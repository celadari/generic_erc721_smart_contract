// Copyright 2023 celadari. All rights reserved. MIT license.
const fs = require('fs');
const mime = require('mime');
const { File, NFTStorage } = require('nft.storage');
const path = require('path');

const upload = async (jsonPath, imagePath, extraParams) => {
    const jsonContent = await fs.promises.readFile(jsonPath, 'utf8');
    const imageContent = await fs.promises.readFile(imagePath);
    const imageType = mime.getType(imagePath);
    const json = JSON.parse(jsonContent);

    const imageFile = await new File([imageContent], path.basename(imagePath), { type: imageType });
    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

    // call client.store, passing in the image & metadata
    return nftStorage.store({
        ...json,
        ...extraParams,
        image: imageFile,
    });
};

module.exports = upload;