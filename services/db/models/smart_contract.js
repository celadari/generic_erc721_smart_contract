// Copyright 2023 celadari. All rights reserved. MIT license.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../sequelize_instance');


const SmartContract = sequelize.define('smart_contract', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        defaultValue: literal("nextval('smart_contracts_id_seq')"),
        primaryKey: true
    },
    jsonUri: {
        type: DataTypes.TEXT,
        field: 'json_uri',
    },
    address: {
        type: DataTypes.TEXT,
        field: 'address',
    },
    externalUrl: {
        type: DataTypes.TEXT,
        field: 'external_url',
    },
}, {
    timestamps: false,
    tableName: 'smart_contracts',
});


const defineSmartContract =  async () => {
    await sequelize.query('CREATE SEQUENCE IF NOT EXISTS smart_contracts_id_seq AS INTEGER MINVALUE 0 MAXVALUE 1 START 0 INCREMENT 1');
    await SmartContract.sync();
    return SmartContract;
};

module.exports = {defineSmartContract, SmartContract};