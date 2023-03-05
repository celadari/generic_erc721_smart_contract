// Copyright 2023 celadari. All rights reserved. MIT license.
const sequelize = require('../sequelize_instance');

const getPreSelectedNonFungibleTokensUnrevealed = async () => {
    const res = await sequelize.query(`
        SELECT pre_nft.token_id, pre_nft.price, pre_users.address, nft.json_uri
        FROM pre_selected_non_fungible_tokens AS pre_nft
        JOIN pre_selected_users AS pre_users ON pre_nft.pre_selected_user_id = pre_users.id
        JOIN non_fungible_tokens AS nft ON pre_nft.token_id = nft.token_id;
    `);

    return res[0];
};

module.exports = getPreSelectedNonFungibleTokensUnrevealed;