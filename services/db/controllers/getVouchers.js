// Copyright 2023 celadari. All rights reserved. MIT license.
const { Voucher } = require('../models/voucher');

const getVoucher = async (address) => {
    const queryResults = await Voucher.findAll({
        where: {address},
    });
    return queryResults.map(queryResult => queryResult.dataValues);
};

module.exports = getVoucher;