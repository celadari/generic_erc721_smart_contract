// Copyright 2023 celadari. All rights reserved. MIT license.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../sequelize_instance');


const UnrevealedToken = sequelize.define('unrevealed_token', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        defaultValue: literal("nextval('unrevealed_tokens_id_seq')"),
        primaryKey: true
    },
    jsonUri: {
        type: DataTypes.TEXT,
        field: 'json_uri',
    },
    domainName: {
        type: DataTypes.TEXT,
        field: 'domain_name',
    },
    domainVersion: {
        type: DataTypes.TEXT,
        field: 'domain_version',
    },
    domainVerifyingContract: {
        type: DataTypes.TEXT,
        field: 'domain_verifying_contract',
    },
    domainChainId: {
        type: DataTypes.INTEGER,
        field: 'domain_chain_id',
    },
    signature: {
        type: DataTypes.TEXT,
        field: 'signature',
    },
}, {
    timestamps: false,
    tableName: 'unrevealed_tokens',
});


const defineUnrevealedToken =  async () => {
    await sequelize.query('CREATE SEQUENCE IF NOT EXISTS unrevealed_tokens_id_seq AS INTEGER MINVALUE 0 MAXVALUE 1 START 0 INCREMENT 1');
    await UnrevealedToken.sync();
    return UnrevealedToken;
};

module.exports = {defineUnrevealedToken, UnrevealedToken};