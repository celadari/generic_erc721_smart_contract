// Copyright 2019 celadari. All rights reserved. MIT license.
const EthSigUtils = require('@metamask/eth-sig-util');
const { updateUnrevealedToken } = require('../../../services/db');


/**
 * Populate table 'vouchers' in Database using table 'pre_selected_non_fungible_tokens'.
 */
module.exports = async function(callback) {
    try {
        const args = require('args-parser')(process.argv);

        const domainName = args.domainName;
        const domainVersion = args.domainVersion;
        const smartContractAddress = args.smartContractAddress;
        const jsonUri = args.jsonUri;
        const signerPublicKey = args.signers.split(',')[parseInt(args.signerIndex)];
        const signerPrivateKey = config['config']['provider'].wallets[signerPublicKey.toLowerCase()].privateKey;
        const chainId = await web3.eth.getChainId();

        const data = {
            types: {
                EIP712Domain: [
                    {name: 'name', type: 'string'},
                    {name: 'version', type: 'string'},
                    {name: 'chainId', type: 'uint256'},
                    {name: 'smartContractAddress', type: 'address'}
                ],
                UnrevealedUriVoucher: [
                    {name: 'uri', type: 'string'},
                ]
            },
            domain: {
                name: domainName,
                version: domainVersion,
                chainId: chainId,
                smartContractAddress: smartContractAddress
            },
            primaryType: 'UnrevealedUriVoucher',
            message: {
                uri: jsonUri,
            }
        };

        const signature = EthSigUtils.signTypedData({
            privateKey: signerPrivateKey,
            data: data,
            version: EthSigUtils.SignTypedDataVersion.V4
        });
        const unrevealedToken = {
            jsonUri: jsonUri,
            domainName: domainName,
            domainVersion: domainVersion,
            domainVerifyingContract: smartContractAddress,
            domainChainId: chainId,
            signature: signature,
        };

        await updateUnrevealedToken(unrevealedToken);
    } catch (e) {
        console.error(e);
    }

    callback();
};