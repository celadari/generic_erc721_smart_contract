// Copyright 2023 celadari. All rights reserved. MIT license.
const keccak256 = require('keccak256');
const SmartContract = artifacts.require('SmartContract');


module.exports = async function(callback) {
    const args = require('args-parser')(process.argv);

    try {
        const role = '0x' + keccak256(args.role).toString('hex');
        const accounts = args.accounts.split(',');
        const instance = await SmartContract.at(args.smartContractAddress);
        const from = args.froms.split(',')[parseInt(args.fromIndex)];

        for (let i = 0; i < accounts.length; i++) {
            await instance.grantRole(role, accounts[i], {from});
        }
    } catch (e) {
        console.error(e);
    }

    // invoke callback
    callback();
};