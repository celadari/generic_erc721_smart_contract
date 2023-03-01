// Copyright 2019 celadari. All rights reserved. MIT license.
const { MerkleTree } = require('../models/merkle_tree_proof');


const insertMerkleTreeNodes = async (nodesProof) => {
    try {
        const result = await MerkleTree.bulkCreate(nodesProof);
        console.log(`Successfully inserted lines into database 'merkle_tree'.`);
        return result;
    } catch (err) {
        console.error(err);
    }
};

module.exports = insertMerkleTreeNodes;