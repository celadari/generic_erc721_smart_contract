// Copyright 2019 celadari. All rights reserved. MIT license.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../sequelize_instance');


const NonFungibleToken = sequelize.define('non_fungible_token', {
    tokenId: {
        type: DataTypes.INTEGER,
        field: 'token_id',
        defaultValue: literal("nextval('non_fungible_tokens_token_id_seq')"),
        primaryKey: true
    },
    jsonUri: {
        type: DataTypes.TEXT,
        field: 'json_uri',
    },
}, {
    timestamps: false,
    tableName: 'non_fungible_tokens',
});


const defineNonFungibleToken =  async () => {
    await sequelize.query(`CREATE SEQUENCE IF NOT EXISTS non_fungible_tokens_token_id_seq AS INTEGER MINVALUE 0 MAXVALUE ${parseInt(process.env.SMART_CONTRACT_TOKENS_NB)-1} START 0 INCREMENT 1`);
    await NonFungibleToken.sync();
    return NonFungibleToken;
};

module.exports = {defineNonFungibleToken, NonFungibleToken};