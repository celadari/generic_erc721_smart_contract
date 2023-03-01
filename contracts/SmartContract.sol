// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import './ERC721.sol';
import './ERC721URIStorage.sol';
import './ERC721Enumerable.sol';
import './ERC721Revealable.sol';
import './ERC721HasAdminRole.sol';
import './ERC721CheckVoucherMint.sol';
import './Exceptions.sol';


contract SmartContract is ERC721,
                      ERC721URIStorage,
                      ERC721Enumerable,
                      AccessControl,
                      ERC721HasAdminRole,
                      Pausable,
                      ERC721Revealable,
                      ERC721CheckVoucherMint {

    string public contractURI_;
    uint256 public publicSaleMinPrice;
    address payable private withdrawAddress;
    uint256 public maxIndexTokens;
    bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');

    constructor(
        string memory name,
        string memory symbol,
        string memory _contractURI,
        address payable _withdrawAddress,
        bytes32 root,
        uint256 _maxIndexTokens,
        uint256 nbTokensPreSaved,
        uint256 _publicSaleMinPrice,
        string memory domainName,
        string memory domainVersion
    ) ERC721(name, symbol, nbTokensPreSaved)
      ERC721URIStorage(nbTokensPreSaved)
      ERC721Revealable(root)
      ERC721CheckVoucherMint(domainName, domainVersion) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(PAUSER_ROLE, ADMIN_ROLE);
        contractURI_ = _contractURI;
        withdrawAddress = _withdrawAddress;
        maxIndexTokens = _maxIndexTokens;
        publicSaleMinPrice = _publicSaleMinPrice;
    }

    function contractURI() public view returns (string memory) {
        return contractURI_;
    }

    function getOwners() public view returns (address[] memory) {
        return _owners;
    }

    function setPublicSaleMinPrice(uint256 minPrice) public onlyRole(ADMIN_ROLE) {
        publicSaleMinPrice = minPrice;
    }

    function remainingToMint() public view returns (uint256) {
        return maxIndexTokens - totalSupply();
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        withdrawAddress.transfer(address(this).balance);
    }

    function safeMint(uint256 qty, UnrevealedUriVoucher memory voucher, bytes memory signature) public payable whenNotPaused {
        if (publicSaleMinPrice > msg.value) revert Exceptions.NotEnoughFunds();
        if (qty + totalSupply() > maxIndexTokens) revert Exceptions.TokensSoldOut();

        _checkVoucher(voucher, signature);
        _safeMint(msg.sender, qty);
        _setTokenURI(voucher.uri, qty);
    }

    function safeMint(NFTVoucher memory voucher, bytes memory signature) public payable whenNotPaused {
        if (voucher.tokenId > totalSupply()) revert Exceptions.InvalidVoucher();
        if (voucher.minPrice > msg.value) revert Exceptions.NotEnoughFunds();
        if (msg.sender != voucher.buyer) revert Exceptions.OnlyBuyerCanSendVoucher();

        _checkVoucher(voucher, signature);
        _assignTokenId(voucher.buyer, voucher.tokenId);
        _updateTokenURI(voucher.tokenId, voucher.uri);
    }

    // The following functions are overrides required by Solidity.
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC721Enumerable, ERC721HasAdminRole, ERC721Revealable, ERC721CheckVoucherMint, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
