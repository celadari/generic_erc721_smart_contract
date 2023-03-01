const SmartContract = artifacts.require('SmartContract');


module.exports = async function(callback) {
    const args = require('args-parser')(process.argv);

    try {
        const instance = await SmartContract.at(args.smartContractAddress);
        const from = args.froms.split(',')[parseInt(args.fromIndex)];
        const action = args.action;

        if (action === 'pause') await instance.pause({from});
        else if (action === 'unpause') await instance.unpause({from});
        else throw new TypeError("Invalid action parameter value. Value should be either 'pause' or 'unpause'.");
    } catch (e) {
        console.error(e);
    }

    // invoke callback
    callback();
};