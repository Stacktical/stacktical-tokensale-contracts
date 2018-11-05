![STACKTICAL](https://storage.googleapis.com/stacktical-public/stacktical_logo-large_transparent_dark_text.png)
# About Stacktical

Stacktical is a french software company specialized in applying predictive and blockchain technologies to application and network performance management practices.

Stacktical.com is a decentralized service level management platform that helps cloud service providers improve the reliability of their services, reward operational excellence and automatically compensate customers for slowdowns, downtimes and unresponsive customer support. 

# DSLA Token Sale

This repository contains the following:  

### - DSLA Token Smart Contract
![My image](https://github.com/Stacktical/stacktical-token-sales/blob/surya-graph/contracts/DSLA/Token-describe.png)  

### - DSLA Sale Smart Contract
![My image](https://github.com/Stacktical/stacktical-token-sales/blob/surya-graph/contracts/Crowdsale/Sale-describe.png)  

### - Unit Tests
### - Deployment files

## Setting up

### To test the smart contract locally

## Requirements:

```
node >= 10.6.0
truffle
local testrpc
```

1/ After the `git clone`, please `npm install` to install all required packages.

*At this stage you can test the Smart Contrats in your local environment*

### To Deploy the smart contract on Testnet & Mainnet

The following instructions use the Infura platform. Infura lets you interact with Smart Contracts without provisioning a local Ethereum node. If you don't have an Infura account yet, please go to [infura.io](https://infura.io) to collect your access token.

2/ Set your environment variables accordingly:

```
export DSLA_INFURA_APIKEY_DEV=<your Infura API Key> \  # <== Your access token from Infura in TESTNET
export DSLA_INFURA_APIKEY_PROD=<your Infura API Key> \  # <== Your access token from Infura in MAINNET
export DSLA_MNEMONIC_DEV="<your dev mnemonic>" \  #  <== The 12 mnemonic words of the account which will deploy the smart contracts in TESTNET
export DSLA_MNEMONIC_PROD="<your PRODUCTION mnemonic>;"  # The 12 mnemonic words of the account which will deploy the smart contracts in MAINNET
```

3/ Set the Smart contract parameters:

* Parameters of the smart contracts can be changed in `migrations/2_deploy_contracts.js`

Watch out: Since the account will be deploying the Smart Contracts, it will also be the owner by default. This can be updated later thanks to the `Ownable` contract (to be found in the OpenZeppelin library).

## Run the Tests

### Locally

Please run `ganache-cli -e 1000 -a 100` in one console and `truffle test` to see the tests.

### Testnet & Mainnet

Please run `truffle migrate --network ropsten` to migrate the smart contracts in the Ropsen TestNet.

### MainNet

Please run `truffle migrate --network mainnet` to migrate the smart contracts on the MainNet.

**WARNING**: If there is change of Smart Contracts for the Token Sale - before the end of the lock-up period - do not forget to edit the Token Sale address accordingly using the `setCrowdsaleAddress()` function from the deployed token, with the address as an argument.

To interact with the contracts, every function has been documented with natspecs norm and therefore thoroughly described.

## Solidity code style

The [Solium](https://github.com/duaraghav8/Solium/) linter is used for linting and specifies the leading rules we follow for code styling, after that comes the [solidity style guide](https://solidity.readthedocs.io/en/v0.4.24/style-guide.html).

**Using solium linter**

*Installing*
```
npm install -g solium
solium -V
```

*Usage*
```
solium -f foobar.sol
solium -d contracts/

```

**functions should be grouped according to their visibility and ordered:**

* constructor
* fallback function (if exists)
* external
* public
* internal
* private

Within a grouping, place the `view` and `pure` functions last.

## Consensys Surya Inheritance

![My image](https://github.com/Stacktical/stacktical-token-sales/blob/surya-graph/contracts/Crowdsale/DSLACrowdsale.png)
![My image](https://github.com/Stacktical/stacktical-token-sales/blob/surya-graph/contracts/DSLA/DSLA.png)

## Consensys Surya Graph

![My image](https://github.com/Stacktical/stacktical-token-sales/blob/surya-graph/MyContract.png)
