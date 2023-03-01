// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import './ERC721.sol';
import './Exceptions.sol';


/**
 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
 * enumerability of all the token ids in the contract as well as all token ids owned by each
 * account.
 */
abstract contract ERC721URIStorage is ERC721 {
    // Optional mapping for token URIs
    string[] private tokenURIs;

    constructor(uint256 nbTokensPreSaved) {
        for (uint256 i = 0; i < nbTokensPreSaved; i++) {
            tokenURIs.push();
        }
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert Exceptions.TokenIndexOutOfBounds();
        return tokenURIs[tokenId];
    }

    function totalURIs() internal view returns (uint256) {
        return tokenURIs.length;
    }

    function getTokenURIs() public view returns (string[] memory) {
        return tokenURIs;
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     * Requirements:
     * - `tokenId` must exist.
     */
    function _setTokenURI(string memory _tokenURI, uint256 qty) internal virtual {
        if (qty == 0) revert Exceptions.MintZeroQuantity();

        for (uint256 i = 0; i < qty; i++) {
            tokenURIs.push(_tokenURI);
        }
    }

    function _updateTokenURI(uint256 tokenId, string memory uri) internal {
        if (tokenId > tokenURIs.length - 1) revert Exceptions.TokenIndexOutOfBounds();
        tokenURIs[tokenId] = uri;
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
