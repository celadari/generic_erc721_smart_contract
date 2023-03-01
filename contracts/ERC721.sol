// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import './Exceptions.sol';


abstract contract ERC721 is IERC721, IERC721Metadata {
    string public name;

    string public symbol;

    function tokenURI(uint256 tokenId) public view virtual returns (string memory);

    // Array which maps token ID to address (index is tokenID)
    address[] internal _owners;

    // Mapping from token ID to approved address
    address[] private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory _name, string memory _symbol, uint256 nbTokensPreSaved) {
        name = _name;
        symbol = _symbol;
        for (uint256 i = 0; i < nbTokensPreSaved; i++) {
            _owners.push();
        }
    }

    // ERC165 LOGIC
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165 Interface ID for ERC165
            interfaceId == 0x80ac58cd || // ERC165 Interface ID for ERC721
            interfaceId == 0x780e9d63 || // ERC165 Interface ID for ERC721Enumerable
            interfaceId == 0x5b5e139f; // ERC165 Interface ID for ERC721Metadata
    }

    //ERC721 LOGIC
    /**
     * @dev Iterates through _owners array, returns balance of address
     * It is not recommended to call this function from another smart contract
     * as it can become quite expensive -- call this function off chain instead.
     */
    function balanceOf(address owner) public view virtual returns (uint256) {
        if (owner == address(0)) revert Exceptions.BalanceQueryForZeroAddress();

        uint256 count;
        uint256 maxToken = _owners.length;
        // Cannot realistically overflow, since we are using uint256
        for (uint256 tokenId = 0; tokenId < maxToken; tokenId++) {
            if (owner == ownerOf(tokenId)) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev See {IERC721-ownerOf}.
     * Gas spent here starts off proportional to the maximum mint batch size.
     * It gradually moves to O(1) as tokens get transferred around in the collection over time.
     */
    function ownerOf(uint256 tokenId) public view virtual returns (address) {
        if (!_exists(tokenId)) revert Exceptions.OwnerQueryForNonexistentToken();

        // Cannot realistically overflow, since we are using uint256
        return _owners[tokenId];
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual {
        address owner = ownerOf(tokenId);
        if (to == owner) revert Exceptions.ApprovalToCurrentOwner();

        if (msg.sender != owner && !isApprovedForAll(owner, msg.sender)) revert Exceptions.ApprovalCallerNotOwnerNorApproved();

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual returns (address) {
        if (!_exists(tokenId)) revert Exceptions.ApprovalQueryForNonexistentToken();

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual {
        if (operator == msg.sender) revert Exceptions.ApproveToCaller();

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Reverts if the `tokenId` has not been minted yet.
     */
    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), 'ERC721: invalid token ID');
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual {
        if (!_exists(tokenId)) revert Exceptions.OwnerQueryForNonexistentToken();
        if (ownerOf(tokenId) != from) revert Exceptions.TransferFromIncorrectOwner();
        if (to == address(0)) revert Exceptions.TransferToZeroAddress();

        bool isApprovedOrOwner = (msg.sender == from ||
            msg.sender == getApproved(tokenId) ||
            isApprovedForAll(from, msg.sender));
        if (!isApprovedOrOwner) revert Exceptions.TransferCallerNotOwnerNorApproved();

        // delete token approvals from previous owner
        _tokenApprovals[tokenId] = address(0);
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual {
        safeTransferFrom(from, to, id, '');
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) public virtual {
        transferFrom(from, to, id);

        if (!_checkOnERC721Received(from, to, id, data)) revert Exceptions.TransferToNonERC721ReceiverImplementer();
    }

    /**
     * @dev Returns whether `tokenId` exists.
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return tokenId < _owners.length;
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.code.length == 0) return true;

        try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data) returns (bytes4 retval) {
            return retval == IERC721Receiver(to).onERC721Received.selector;
        } catch (bytes memory reason) {
            if (reason.length == 0) revert Exceptions.TransferToNonERC721ReceiverImplementer();

            assembly {
                revert(add(32, reason), mload(reason))
            }
        }
    }

    function _safeMint(address to, uint256 qty) internal virtual {
        _safeMint(to, qty, '');
    }

    function _safeMint(
        address to,
        uint256 qty,
        bytes memory data
    ) internal virtual {
        _mint(to, qty);

        if (!_checkOnERC721Received(address(0), to, _owners.length - 1, data))
            revert Exceptions.TransferToNonERC721ReceiverImplementer();
    }

    function _mint(address to, uint256 qty) internal virtual {
        if (to == address(0)) revert Exceptions.MintToZeroAddress();
        if (qty == 0) revert Exceptions.MintZeroQuantity();

        uint256 _currentIndex = _owners.length;
        for (uint256 i = 0; i < qty; i++) {
            _owners.push(to);
            emit Transfer(address(0), to, _currentIndex + i);
        }
    }

    function _assignTokenId(address to, uint256 tokenId) internal virtual {
        _assignTokenId(to, tokenId, '');
    }

    function _assignTokenId(
        address to,
        uint256 tokenId,
        bytes memory data
    ) internal virtual {
        if (to == address(0)) revert Exceptions.MintToZeroAddress();
        if (tokenId > _owners.length) revert Exceptions.TokenIndexOutOfBounds();
        _owners[tokenId] = to;

        if (!_checkOnERC721Received(address(0), to, _owners.length - 1, data))
            revert Exceptions.TransferToNonERC721ReceiverImplementer();
    }
}