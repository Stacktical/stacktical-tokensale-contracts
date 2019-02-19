require('dotenv').config()
const DSLACrowdsale = artifacts.require('./DSLACrowdsale.sol');

module.exports =  function(deployer, network) {
    let wallet;
    let DSLATokenAddress;

    if (network === 'development') {
        wallet = "0x1234567890";
        DSLATokenAddress = "0x1234567891"
    } else if (network === 'ropsten') {
        wallet = "0x88D60762B80C27E180da63a94f81591Aa122c101";
        DSLATokenAddress = "0x0ee0a69c62c2f06dc41464e94eb75532a0145f9f"
    } else if (network === 'mainnet') {
        wallet = process.env.DSLA_WALLET_ADDRESS_PROD
        DSLATokenAddress = process.env.DSLA_TOKEN_ADDRESS_PROD
    }

    return deployer.deploy(DSLACrowdsale, wallet, DSLATokenAddress)
}
