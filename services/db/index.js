// Copyright 2023 celadari. All rights reserved. MIT license.
const sequelize = require('./sequelize_instance');

// import models
const { defineNonFungibleToken, NonFungibleToken } = require('./models/non_fungible_token');
const { definePreNonFungibleToken, PreNonFungibleToken } = require('./models/pre_non_fungible_token');
const { definePreSelectedUser, PreSelectedUser } = require('./models/pre_selected_user');
const { definePreSelectedNonFungibleToken, PreSelectedNonFungibleToken } = require('./models/pre_selected_non_fungible_token');
const { defineVoucher, Voucher } = require('./models/voucher');
const { defineSmartContract, SmartContract } = require('./models/smart_contract');
const { defineUnrevealedToken, UnrevealedToken } = require('./models/unrevealed_token');
const { defineMerkleTreeProof, MerkleTreeProof } = require('./models/merkle_tree_proof');

// import controllers
const getPreNonFungibleTokens = require('./controllers/getPreNonFungibleTokens');
const getPreSelectedNonFungibleTokensUnrevealed = require('./controllers/getPreSelectedNonFungibleTokensUnrevealed');
const insertNonFungibleToken = require('./controllers/insertNonFungibleToken');
const insertVouchers = require('./controllers/insertVouchers');
const insertSmartContract = require('./controllers/insertSmartContract');
const getSmartContract = require('./controllers/getSmartContract');
const insertUnrevealedToken = require('./controllers/insertUnrevealedToken');
const getNonFungibleTokens = require('./controllers/getNonFungibleTokens');
const insertMerkleTreeNodes = require('./controllers/insertMerkleTreeNodes');
const updateSmartContract = require('./controllers/updateSmartContract');
const getVouchers = require('./controllers/getVouchers');
const updateUnrevealedToken = require('./controllers/updateUnrevealedToken');


(async () => {
    try {
        // create tables
        await definePreNonFungibleToken();
        await defineNonFungibleToken();
        await definePreSelectedUser();
        await definePreSelectedNonFungibleToken();
        await defineSmartContract();
        await defineVoucher();
        await defineUnrevealedToken();
        await defineMerkleTreeProof();
    } catch (e) {
        console.error('Something went wrong when trying to define a table in Database', e);
    }
})();


module.exports = {
    sequelize,
    PreNonFungibleToken,
    NonFungibleToken,
    PreSelectedUser,
    PreSelectedNonFungibleToken,
    SmartContract,
    Voucher,
    UnrevealedToken,
    MerkleTreeProof,
    getPreNonFungibleTokens,
    getPreSelectedNonFungibleTokensUnrevealed,
    insertNonFungibleToken,
    insertVouchers,
    insertSmartContract,
    getSmartContract,
    insertUnrevealedToken,
    getNonFungibleTokens,
    insertMerkleTreeNodes,
    updateSmartContract,
    getVouchers,
    updateUnrevealedToken,
};