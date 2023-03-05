// Copyright 2023 celadari. All rights reserved. MIT license.
const { UnrevealedToken } = require('../models/unrevealed_token');

const insertUnrevealedToken = async (jsonUri) => {
    try {
        const result = await UnrevealedToken.create({jsonUri});
        console.log(`Successfully inserted one line DataBase 'unrevealed_token' with 'json_uri': ${jsonUri}`);
        return result;
    } catch (err) {
        console.error(err);
    }
};

module.exports = insertUnrevealedToken;