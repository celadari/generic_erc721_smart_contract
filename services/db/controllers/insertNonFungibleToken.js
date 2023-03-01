// Copyright 2019 celadari. All rights reserved. MIT license.
const { NonFungibleToken } = require('../models/non_fungible_token');

const insertNonFungibleToken = async (jsonUri) => {
    try {
        const insertedRow = await NonFungibleToken.create({jsonUri});
        console.log(`Successfully inserted into DataBase 'non_fungible_tokens' with 'tokenId': ${insertedRow.tokenId}, 'json_uri': ${jsonUri}`);
        return insertedRow;
    } catch (err) {
        console.error(err);
    }
};

module.exports = insertNonFungibleToken;