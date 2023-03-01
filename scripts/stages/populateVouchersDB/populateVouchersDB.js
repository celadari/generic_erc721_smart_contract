// Copyright 2019 celadari. All rights reserved. MIT license.
const EthSigUtils = require('@metamask/eth-sig-util');
const { getPreSelectedNonFungibleTokensUnrevealed, insertVouchers } = require('../../../services/db');


/**
 * Populate table 'vouchers' in Database using table 'pre_selected_non_fungible_tokens'.
 */
module.exports = async function(callback) {
    try {
        const args = require('args-parser')(process.argv);

        const domainName = args.domainName;
        const domainVersion = args.domainVersion;
        const smartContractAddress = args.smartContractAddress;
        const signerPublicKey = args.signers.split(',')[parseInt(args.signerIndex)];
        const signerPrivateKey = config['config']['provider'].wallets[signerPublicKey.toLowerCase()].privateKey;
        const isRevealed = JSON.parse(args.isRevealed);
        const chainId = await web3.eth.getChainId();

        const preSelectedNFTs = await getPreSelectedNonFungibleTokensUnrevealed();
        const vouchers = [];

        for (let i = 0; i < preSelectedNFTs.length; i++) {
            const preSelectedNFT = preSelectedNFTs[i];
            const uri = isRevealed ? preSelectedNFT['json_uri'] : args.unrevealedJsonUri;
            const data = {
                types: {
                    EIP712Domain: [
                        {name: 'name', type: 'string'},
                        {name: 'version', type: 'string'},
                        {name: 'chainId', type: 'uint256'},
                        {name: 'smartContractAddress', type: 'address'}
                    ],
                    NFTVoucher: [
                        {name: 'tokenId', type: 'uint256'},
                        {name: 'minPrice', type: 'uint256'},
                        {name: 'buyer', type: 'address'},
                        {name: 'uri', type: 'string'},
                    ]
                },
                domain: {
                    name: domainName,
                    version: domainVersion,
                    chainId: chainId,
                    smartContractAddress: smartContractAddress
                },
                primaryType: 'NFTVoucher',
                message: {
                    tokenId: preSelectedNFT['token_id'],
                    minPrice: preSelectedNFT['price'],
                    buyer: preSelectedNFT['address'],
                    uri: uri,
                }
            };

            const signature = EthSigUtils.signTypedData({
                privateKey: signerPrivateKey,
                data: data,
                version: EthSigUtils.SignTypedDataVersion.V4
            });

            vouchers.push({
                tokenId: preSelectedNFT['token_id'],
                isRevealed: isRevealed,
                address: preSelectedNFT['address'],
                jsonUri: uri,
                price: preSelectedNFT['price'],
                domainName: domainName,
                domainVersion: domainVersion,
                domainVerifyingContract: smartContractAddress,
                domainChainId: chainId,
                signature: signature,
            });
        }

        await insertVouchers(vouchers);
    } catch (e) {
        console.error(e);
    }

    callback();
};