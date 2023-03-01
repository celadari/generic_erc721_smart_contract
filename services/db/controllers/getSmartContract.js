// Copyright 2019 celadari. All rights reserved. MIT license.
const { SmartContract } = require('../models/smart_contract');

const getSmartContract = async () => {
    const queryResults = await SmartContract.findAll({
        attributes: ['json_uri', 'address'],
    });
    return queryResults.map(queryResult => queryResult.dataValues);
};

module.exports = getSmartContract;