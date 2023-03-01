// Copyright 2019 celadari. All rights reserved. MIT license.
const { Voucher } = require('../models/voucher');

const insertVouchers = async (vouchers) => {
    try {
        const insertedRows = await Voucher.bulkCreate(vouchers);
        console.log(`Successfully inserted into DataBase 'vouchers' ${insertedRows.length} rows`);
        return insertedRows;
    } catch (err) {
        console.error(err);
    }
};

module.exports = insertVouchers;