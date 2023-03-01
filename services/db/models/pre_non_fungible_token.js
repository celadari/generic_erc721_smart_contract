// Copyright 2019 celadari. All rights reserved. MIT license.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../sequelize_instance');


const PreNonFungibleToken = sequelize.define('pre_non_fungible_token', {
    tokenId: {
        type: DataTypes.INTEGER,
        field: 'token_id',
        defaultValue: literal("nextval('pre_non_fungible_tokens_token_id_seq')"),
        primaryKey: true
    },
    imageFilename: {
        type: DataTypes.TEXT,
        field: 'image_filename',
    },
    jsonFilename: {
        type: DataTypes.TEXT,
        field: 'json_filename',
    },
}, {
    timestamps: false,
    tableName: 'pre_non_fungible_tokens',
});


const definePreNonFungibleToken =  async () => {
    await sequelize.query(`CREATE SEQUENCE IF NOT EXISTS pre_non_fungible_tokens_token_id_seq AS INTEGER MINVALUE 0 MAXVALUE ${parseInt(process.env.SMART_CONTRACT_TOKENS_NB)-1} START 0 INCREMENT 1`);
    await PreNonFungibleToken.sync();
    return PreNonFungibleToken;
};

module.exports = {definePreNonFungibleToken, PreNonFungibleToken};