// Copyright 2019 celadari. All rights reserved. MIT license.
const { NonFungibleToken } = require('../models/non_fungible_token');

const getNonFungibleTokens = async () => {
    const queryResults = await NonFungibleToken.findAll({
        attributes: ['token_id', 'json_uri'],
        order: [
            ['token_id', 'ASC'],
        ],
    });
    return queryResults.map(queryResult => queryResult.dataValues);
};

module.exports = getNonFungibleTokens;