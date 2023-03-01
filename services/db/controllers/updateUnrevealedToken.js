// Copyright 2019 celadari. All rights reserved. MIT license.
const { UnrevealedToken } = require('../models/unrevealed_token');

const updateUnrevealedToken = async (unrevealedToken) => {
    try {
        const result = await UnrevealedToken.update(unrevealedToken, {where: {id: 0}});
        console.log(`Successfully updated one line DataBase 'unrevealed_token' with 'json_uri': ${unrevealedToken.jsonUri}`);
        return result;
    } catch (err) {
        console.error(err);
    }
};

module.exports = updateUnrevealedToken;