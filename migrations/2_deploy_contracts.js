require('dotenv').config()
const DSLACrowdsale = artifacts.require('./DSLACrowdsale.sol');

module.exports =  function(deployer, network) {
    let wallet;
    let DSLATokenAddress;

    if (network === 'development') {
        wallet = "0x1234567890";
        DSLATokenAddress = "0x1234567891"
    } else if (network === 'ropsten') {
        wallet = process.env.DSLA_WALLET_ADDRESS_ROPSTEN_DEV
        DSLATokenAddress = process.env.DSLA_TOKEN_ADDRESS_ROPSTEN_DEV
    } else if (network === 'mainnet') {
        wallet = process.env.DSLA_WALLET_ADDRESS_PROD
        DSLATokenAddress = process.env.DSLA_TOKEN_ADDRESS_PROD
    }

    return deployer.deploy(DSLACrowdsale, wallet, DSLATokenAddress)
}
