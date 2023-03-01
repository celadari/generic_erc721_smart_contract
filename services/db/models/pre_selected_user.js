// Copyright 2019 celadari. All rights reserved. MIT license.
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize_instance');

const PreSelectedUser = sequelize.define('pre_selected_user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    address: DataTypes.TEXT
}, {
    timestamps: false,
    tableName: 'pre_selected_users'
});

const definePreSelectedUser = async () => {
    await PreSelectedUser.sync();
    return PreSelectedUser;
};

module.exports = {definePreSelectedUser, PreSelectedUser};