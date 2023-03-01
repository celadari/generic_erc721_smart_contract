// Copyright 2019 celadari. All rights reserved. MIT license.
const upload = require('../../functions/upload');
const { insertNonFungibleToken, getPreNonFungibleTokens } = require('../../../services/db');

/**
 * Uploads the json and images of each token on IPFS and saves the uri on the DataBase
 */
if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        const args = require('args-parser')(process.argv);

        const extraParams = {external_url: process.env.SMART_CONTRACT_EXTERNAL_URL};
        const preNFTs = await getPreNonFungibleTokens();

        for (let i = 0; i < preNFTs.length; i++) {
            const preNFT = preNFTs[i];
            const uploadResult = await upload(args.jsonDir + preNFT['json_filename'], args.imageDir + preNFT['image_filename'], extraParams);
            await insertNonFungibleToken(uploadResult.url);
        }
    })();
}