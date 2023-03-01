// Copyright 2019 celadari. All rights reserved. MIT license.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../sequelize_instance');

const PreSelectedNonFungibleToken = sequelize.define('pre_selected_non_fungible_token', {
    tokenId: {
        type: DataTypes.INTEGER,
        field: 'token_id',
        defaultValue: literal("nextval('pre_selected_non_fungible_tokens_token_id_seq')"),
        primaryKey: true
    },
    price: {
        type: DataTypes.INTEGER,
        field: 'price',
    },
    preSelectedUserId: {
        type: DataTypes.INTEGER,
        field: 'pre_selected_user_id',
        references: {
            model: 'pre_selected_users',
            key: 'id',
        },
    },
}, {
    timestamps: false,
    tableName: 'pre_selected_non_fungible_tokens',
});


const definePreSelectedNonFungibleToken = async () => {
    await sequelize.query(`CREATE SEQUENCE IF NOT EXISTS pre_selected_non_fungible_tokens_token_id_seq AS INTEGER MINVALUE 0 MAXVALUE ${process.env.SMART_CONTRACT_TOKENS_NB} START 0 INCREMENT 1;`);
    await PreSelectedNonFungibleToken.sync();
    return PreSelectedNonFungibleToken;
};

module.exports = { definePreSelectedNonFungibleToken, PreSelectedNonFungibleToken };