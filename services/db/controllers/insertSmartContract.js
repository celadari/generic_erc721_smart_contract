// Copyright 2023 celadari. All rights reserved. MIT license.
const { SmartContract } = require('../models/smart_contract');

const insertSmartContract = async (jsonUri, externalUrl) => {
    try {
        const result = await SmartContract.create({jsonUri, externalUrl});
        console.log(`Successfully inserted one line DataBase 'smart_contract' with 'json_uri': ${jsonUri}, 'external_url': ${externalUrl}`);
        return result;
    } catch (err) {
        console.error(err);
    }
};

module.exports = insertSmartContract;