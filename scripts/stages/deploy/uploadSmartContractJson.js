// Copyright 2023 celadari. All rights reserved. MIT license.
const upload = require('../../functions/upload');
const { insertSmartContract } = require('../../../services/db');

/**
 * Uploads the json and images of the smart contract on IPFS and saves the uri on the DataBase
 */
if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        const args = require('args-parser')(process.argv);

        const extraParams = {fee_recipient: process.env.SMART_CONTRACT_FEE_RECIPIENT_ADDRESS, external_url: process.env.SMART_CONTRACT_EXTERNAL_URL};
        const uploadResult = await upload(args.jsonPath, args.imagePath, extraParams);
        const jsonURI = uploadResult.url;

        console.log(`Smart contract json uri: ${jsonURI}`);
        await insertSmartContract(jsonURI, extraParams['external_url']);
    })();
}