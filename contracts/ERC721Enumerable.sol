// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';
import './ERC721.sol';
import './Exceptions.sol';


/**
 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
 * enumerability of all the token ids in the contract as well as all token ids owned by each
 * account.
 */
abstract contract ERC721Enumerable is ERC721, IERC721Enumerable {

    /**
     * @dev See {IERC721Enumerable-totalSupply}.
     */
    function totalSupply() public view returns (uint256) {
        return _owners.length;
    }

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     * Dont call this function on chain from another smart contract, since it can become quite expensive
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) public view virtual returns (uint256 tokenId) {
        if (index >= totalSupply()) revert Exceptions.TokenIndexOutOfBounds();
        if (index >= balanceOf(owner)) revert Exceptions.OwnerIndexOutOfBounds();

        uint256 count;
        uint256 maxToken = _owners.length;
        // Cannot realistically overflow, since we are using uint256
        for (tokenId = 0; tokenId < maxToken; tokenId++) {
            if (owner == ownerOf(tokenId)) {
                if (count == index) return tokenId;
                else count++;
            }
        }

        revert Exceptions.UnableGetTokenOwnerByIndex();
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        if (index >= totalSupply()) revert Exceptions.TokenIndexOutOfBounds();
        return index;
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override(ERC721, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
