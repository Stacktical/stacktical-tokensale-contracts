const DSLACrowdsale = artifacts.require('./DSLACrowdsale.sol');

module.exports =  function(deployer, network) {
    let wallet;
    let DSLATokenAddress;

    if (network === 'development') {
        wallet = "0x1234567890";
        DSLATokenAddress = "0x1234567891"
    }

    return deployer.deploy(DSLACrowdsale, wallet, DSLATokenAddress)
}
