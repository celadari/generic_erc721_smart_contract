// Copyright 2023 celadari. All rights reserved. MIT license.
const { SmartContract } = require('../models/smart_contract');

const updateSmartContract = async (address) => {
    try {
        const result = await SmartContract.update({address}, {where: {id: 0}});
        console.log(`Successfully updated one line DataBase 'smart_contract' with 'address': ${address}`);
        return result;
    } catch (err) {
        console.error(err);
    }
};

module.exports = updateSmartContract;