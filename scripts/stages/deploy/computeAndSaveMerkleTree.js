// Copyright 2019 celadari. All rights reserved. MIT license.
const { getNonFungibleTokens, insertMerkleTreeNodes } = require('../../../services/db');
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');
const Web3EthAbi = require('web3-eth-abi');


/**
 * Computes merkle tree root hash of array of uri.
 * Used at reveal time for users to reveal their tokens by providing merkle proof of their uri.
 */
if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        const nonFungibleTokens = await getNonFungibleTokens();
        const structKeccak256 = keccak256('UriRevealData(uint256 tokenId,string uri)');

        const leaves = nonFungibleTokens.map(nft => keccak256(Web3EthAbi.encodeParameters(['bytes32', 'uint256', 'string'], [structKeccak256, nft['token_id'], nft['json_uri']])));
        const merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true});

        const proofs = [{proof: [merkleTree.getHexRoot()], jsonUri: null}];
        for (let i = 0; i < nonFungibleTokens.length; i++) {
            const proof = merkleTree.getHexProof(merkleTree.getLeaf(i));
            proofs.push({proof: proof, jsonUri: nonFungibleTokens[i]['json_uri']});
        }
        await insertMerkleTreeNodes(proofs);
    })();
}
