// Copyright 2023 celadari. All rights reserved. MIT license.
const { PreNonFungibleToken } = require('../models/pre_non_fungible_token');

const getPreNonFungibleTokens = async () => {
    const queryResults = await PreNonFungibleToken.findAll({
        attributes: ['token_id', 'image_filename', 'json_filename'],
    });
    return queryResults.map(queryResult => queryResult.dataValues);
};

module.exports = getPreNonFungibleTokens;