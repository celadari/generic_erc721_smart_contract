// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import './ERC721.sol';
import './ERC721HasAdminRole.sol';
import './Exceptions.sol';


abstract contract ERC721CheckVoucherMint is ERC721, ERC721HasAdminRole {

    struct NFTVoucher {
        uint256 tokenId;
        uint256 minPrice;
        address buyer;
        string uri;
    }
    struct UnrevealedUriVoucher {
        string uri;
    }

    bytes32 public constant MINT_SIGNER_ROLE = keccak256('MINT_SIGNER_ROLE');
    bytes32 private DOMAIN_SEPARATOR;

    constructor(string memory domainName, string memory domainVersion) {
        DOMAIN_SEPARATOR = keccak256(abi.encode(
                keccak256('EIP712Domain(string name,string version,uint256 chainId,address smartContractAddress)'),
                keccak256(bytes(domainName)),
                keccak256(bytes(domainVersion)),
                uint256(block.chainid),
                address(this)
        ));
        _setRoleAdmin(MINT_SIGNER_ROLE, ADMIN_ROLE);
    }

    function _checkVoucher(UnrevealedUriVoucher memory voucher, bytes memory signature) virtual internal {
        bytes32 structHash = keccak256(abi.encode(
                keccak256('UnrevealedUriVoucher(string uri)'),
                keccak256(bytes(voucher.uri))
        ));

        bytes32 hashTypedDataV4 = keccak256(abi.encodePacked(
                uint16(0x1901),
                DOMAIN_SEPARATOR,
                structHash
        ));

        address signer = ECDSA.recover(hashTypedDataV4, signature);
        if (!hasRole(MINT_SIGNER_ROLE, signer)) revert Exceptions.UnauthorizedMintSigner();
    }

    function _checkVoucher(NFTVoucher memory voucher, bytes memory signature) virtual internal {
        bytes32 structHash = keccak256(abi.encode(
                keccak256('NFTVoucher(uint256 tokenId,uint256 minPrice,address buyer,string uri)'),
                voucher.tokenId,
                voucher.minPrice,
                voucher.buyer,
                keccak256(bytes(voucher.uri))
        ));

        bytes32 hashTypedDataV4 = keccak256(abi.encodePacked(
                uint16(0x1901),
                DOMAIN_SEPARATOR,
                structHash
            ));

        address signer = ECDSA.recover(hashTypedDataV4, signature);
        if (!hasRole(MINT_SIGNER_ROLE, signer)) revert Exceptions.UnauthorizedMintSigner();
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override(ERC721, ERC721HasAdminRole) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}