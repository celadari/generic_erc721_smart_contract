// Copyright 2019 celadari. All rights reserved. MIT license.
const upload = require('../../functions/upload');
const { insertUnrevealedToken } = require('../../../services/db');

/**
 * Uploads the json and images of unrevealed token state.
 */
if (typeof require !== 'undefined' && require.main === module) {
    (async () => {
        const args = require('args-parser')(process.argv);

        const extraParams = {external_url: process.env.SMART_CONTRACT_EXTERNAL_URL};
        const uploadResult = await upload(args.jsonPath, args.imagePath, extraParams);

        console.log(`Unrevealed NFT json uri: ${uploadResult.url}`);
        await insertUnrevealedToken(uploadResult.url);
    })();
}