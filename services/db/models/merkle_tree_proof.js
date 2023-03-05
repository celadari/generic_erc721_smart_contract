// Copyright 2023 celadari. All rights reserved. MIT license.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../sequelize_instance');


const MerkleTreeProof = sequelize.define('merkle_tree_proof', {
    tokenId: {
        type: DataTypes.INTEGER,
        field: 'token_id',
        defaultValue: literal("nextval('merkle_tree_proofs_token_id_seq')"),
        primaryKey: true
    },
    proof: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        field: 'proof',
    },
    jsonUri: {
        type: DataTypes.STRING,
        field: 'json_uri',
    },
}, {
    timestamps: false,
    tableName: 'merkle_tree_proofs',
});


const defineMerkleTreeProof =  async () => {
    await sequelize.query(`CREATE SEQUENCE IF NOT EXISTS merkle_tree_proofs_token_id_seq AS INTEGER MINVALUE -1 MAXVALUE ${parseInt(process.env.SMART_CONTRACT_TOKENS_NB)-1} START -1 INCREMENT 1;`);
    await MerkleTreeProof.sync();
    return MerkleTreeProof;
};

module.exports = {defineMerkleTreeProof, MerkleTree: MerkleTreeProof};