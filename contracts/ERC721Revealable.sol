// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import './ERC721.sol';
import './ERC721URIStorage.sol';
import './Exceptions.sol';


/**
 * @dev This implements an optional extension of {ERC721} defined in the EIP that adds
 * enumerability of all the token ids in the contract as well as all token ids owned by each
 * account.
 */
abstract contract ERC721Revealable is ERC721, ERC721URIStorage {
    struct UriRevealData {
        uint256 tokenId;
        string uri;
    }

    bytes32 public revealMerkleRoot;

    constructor(bytes32 root) {
        revealMerkleRoot = root;
    }

    function reveal(bytes32[][] memory merkleProofs, UriRevealData[] memory revealData) public {
        if (merkleProofs.length != revealData.length) revert Exceptions.MerkleProofsArrayAndRevealDataNotSameLength();

        for (uint256 i=0; i < merkleProofs.length; i++) {
            revealToken(merkleProofs[i], revealData[i]);
        }
    }

    function revealToken(bytes32[] memory merkleProof, UriRevealData memory revealDatum) public {
        bytes32 leaf = keccak256(abi.encode(
                keccak256('UriRevealData(uint256 tokenId,string uri)'),
                revealDatum.tokenId,
                revealDatum.uri
        ));

        if (ownerOf(revealDatum.tokenId) != msg.sender) revert Exceptions.SenderMerkleProofIsNotOwnerOfToken();
        if (!MerkleProof.verify(merkleProof, revealMerkleRoot, leaf)) revert Exceptions.MerkleProofInvalid();

        _updateTokenURI(revealDatum.tokenId, revealDatum.uri);
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
