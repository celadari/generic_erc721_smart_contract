// Copyright 2019 celadari. All rights reserved. MIT license.
const SmartContract = artifacts.require('SmartContract');
const args = require('args-parser')(process.argv);
const { updateSmartContract } = require('../services/db');

module.exports = async function(deployer) {
  const smartContractJsonUri = args.smartContractJsonUri;
  const merkleTreeRoot = args.merkleTreeRoot;
  const withdrawAddress = args.withdrawAddress
  const maxIndexTokens = args.maxIndexTokens;
  const nbTokensPreSaved = args.nbTokensPreSaved;
  const domainName = args.domainName;
  const domainVersion = args.domainVersion;
  const name = args.name;
  const symbol = args.symbol;
  const publicSaleMinPrice = BigInt(args.publicSaleMinPrice);

  await deployer.deploy(
      SmartContract,
      name,
      symbol,
      smartContractJsonUri,
      withdrawAddress,
      merkleTreeRoot,
      maxIndexTokens,
      nbTokensPreSaved,
      publicSaleMinPrice,
      domainName,
      domainVersion
  );
  await updateSmartContract(SmartContract.address);
};
