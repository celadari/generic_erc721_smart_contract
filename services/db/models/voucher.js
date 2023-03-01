// Copyright 2019 celadari. All rights reserved. MIT license.
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_instance');


const Voucher = sequelize.define('voucher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tokenId: {
        type: DataTypes.INTEGER,
        field: 'token_id',
    },
    isRevealed: {
        type: DataTypes.BOOLEAN,
        field: 'is_revealed',
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        field: 'address',
    },
    signature: {
        type: DataTypes.TEXT,
        field: 'signature',
    },
    jsonUri: {
        type: DataTypes.STRING,
        field: 'json_uri',
    },
    price: {
        type: DataTypes.FLOAT,
        field: 'price',
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
}, {
    timestamps: false,
    tableName: 'vouchers',
});


const defineVoucher =  async () => {
    await Voucher.sync();
    return Voucher;
};

module.exports = {defineVoucher, Voucher};