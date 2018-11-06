import assertRevert from './helpers/assertRevert';
import latestTime from './helpers/latestTime';
import { increaseTimeTo, duration } from './helpers/increaseTime';

const Token = artifacts.require('./DSLAMock.sol');
const Crowdsale = artifacts.require('./DSLACrowdsale.sol');
const BigNumber = web3.BigNumber;

contract('ROUND 3', function ([owner, project, anotherAccount, user1, user2, wallet]) {
    let token;
    let crowdsale;
    const tokensToSell = new BigNumber('5e27');
    const rate = 250000;
    const individualFloor = web3.toWei('3', 'ether');
    const individualCap = web3.toWei('30', 'ether');
    const softCap = web3.toWei('7200', 'ether');
    const hardCap = web3.toWei('17200', 'ether');

    beforeEach('redeploy', async function () {
        token = await Token.new({from : owner});
        crowdsale = await Crowdsale.new(wallet, token.address, {from : owner});

        await token.transfer(crowdsale.address, tokensToSell, {from : owner});
    });

    describe('Sale period', function () {
        it('rejects a contribution made when sale not yet starting', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            await assertRevert(crowdsale.sendTransaction( { from: user1 , value: paymentAmount }));
        });
        it('rejects adding a contributor when sale not yet starting', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            await assertRevert(crowdsale.addPrivateSaleContributors(user1, paymentAmount, { from : owner }));
        });
        it('rejects adding a contribution from other currencies when sale not yet starting', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            await assertRevert(crowdsale.addOtherCurrencyContributors(user1, paymentAmount, 3, { from : owner }));
        });
        it('rejects a contribution made from a non whitlisted account when sale is started', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});

            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            await assertRevert(crowdsale.sendTransaction( { from: user1 , value: paymentAmount }));
        });
        it('rejects a contribution made from a whitlisted account less than the individual floor == 3 ether', async function () {
            const paymentAmount = web3.toWei('2', 'ether');

            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            await crowdsale.addToWhitelist(user1, {from : owner});
            assert.equal(await crowdsale.whitelist(user1), true);

            await assertRevert(crowdsale.sendTransaction( { from: user1 , value: paymentAmount }));
        });
        it('rejects a contribution made from a whitlisted account more than the individual cap == 30 ether', async function () {
            const paymentAmount = web3.toWei('31', 'ether');

            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            await crowdsale.addToWhitelist(user1, {from : owner});
            assert.equal(await crowdsale.whitelist(user1), true);

            await assertRevert(crowdsale.sendTransaction( { from: user1 , value: paymentAmount }));
        });
        it('rejects a second contribution from a whitlisted account when sale is started', async function () {
            const paymentAmount = web3.toWei('3', 'ether');

            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            await crowdsale.addToWhitelist(user1, {from : owner});
            assert.equal(await crowdsale.whitelist(user1), true);

            await crowdsale.sendTransaction({ from: user1 , value: paymentAmount });
            await assertRevert(crowdsale.sendTransaction({ from: user1 , value: paymentAmount }));
        });
        it('accepts a contribution made from a whitlisted account when sale is started', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            let actualBalance = await web3.eth.getBalance(wallet);

            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            await crowdsale.addToWhitelist(user1, {from : owner});
            assert.equal(await crowdsale.whitelist(user1), true);

            await crowdsale.sendTransaction({ from: user1 , value: paymentAmount });

            // check DSLA balance
            let balance = new BigNumber(3 * rate * 0.75).mul(1e18);
            assert.equal(await token.balanceOf(user1), balance.valueOf());

            // check distributed tokens value
            assert.equal(await crowdsale.distributedTokens.call().valueOf(), balance.valueOf());

            // check vested tokens value
            let vestedTokens = new BigNumber(3 * rate * 0.25).mul(1e18);
            assert.equal(await crowdsale.vestedTokens.call().valueOf(), vestedTokens.valueOf());
            // check raised funds value
            assert.equal(await crowdsale.raisedFunds.call().valueOf(), paymentAmount.valueOf());
        });
        it('accepts adding a contributor when sale is started', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            let rate_privatesale = 416700;
            let actualBalance = await web3.eth.getBalance(wallet);

            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 2);

            await crowdsale.addPrivateSaleContributors(user1 , paymentAmount, {from : owner});
            assert.equal(await crowdsale.whitelist(user1), true);
            // check DSLA balance
            let balance = paymentAmount * rate_privatesale * 0.25;
            assert.equal(await token.balanceOf(user1), balance.valueOf());

            // check distributed tokens value
            assert.equal(await crowdsale.distributedTokens.call().valueOf(), balance.valueOf());

            // check vested tokens value
            let vestedTokens = new BigNumber(3 * rate_privatesale * 0.75).mul(1e18);
            assert.equal(await crowdsale.vestedTokens.call().valueOf(), vestedTokens.valueOf());
            // check raised funds value
            assert.equal(await crowdsale.raisedFunds.call().valueOf(), paymentAmount.valueOf());
        });
        it('accepts adding a contributor from other currencies when sale is started', async function () {
            const paymentAmount = web3.toWei('3', 'ether');
            let round = 3;
            let actualBalance = await web3.eth.getBalance(wallet);

            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            await crowdsale.addOtherCurrencyContributors(user1 , paymentAmount, round, {from : owner});
            assert.equal(await crowdsale.whitelist(user1), true);
            // check DSLA balance
            let balance = new BigNumber(3 * rate * 0.75).mul(1e18);
            assert.equal(await token.balanceOf(user1), balance.valueOf());

            // check distributed tokens value
            assert.equal(await crowdsale.distributedTokens.call().valueOf(), balance.valueOf());

            // check vested tokens value
            let vestedTokens = new BigNumber(3 * rate * 0.25).mul(1e18);
            assert.equal(await crowdsale.vestedTokens.call().valueOf(), vestedTokens.valueOf());
            // check raised funds value
            assert.equal(await crowdsale.raisedFunds.call().valueOf(), paymentAmount.valueOf());
            // check raised funds from other currencies
            assert.equal(await crowdsale.weiRaisedFromOtherCurrencies.call().valueOf(), paymentAmount.valueOf());
        });
        it('finalizes crowdsale and burns unsold tokens', async function () {
            let addresses = web3.eth.accounts.slice (5, 99);
            await crowdsale.addAddressToWhitelist(addresses, {from : owner});

            // Round 1 contributions
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 1);

            addresses.slice(0, 10).map(async address => {
              await crowdsale.addPrivateSaleContributors(address , web3.toWei('110', 'ether'), {from : owner});
            });

            // Round 2 contributions
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 2);

            addresses.slice(10, 24).map(async address => {
              await crowdsale.sendTransaction({from : address, value: web3.toWei('350', 'ether')});
            });

            // Round 3 contributions
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            addresses.slice(24, 75).map(async address => {
              return await crowdsale.sendTransaction({from : address, value: web3.toWei('29', 'ether')});
            });

            let raisedFunds = new BigNumber(await crowdsale.raisedFunds.call()).toNumber();

            // SoftCap reached
            assert.isAbove(raisedFunds, new BigNumber(softCap).toNumber());
            assert.isBelow(raisedFunds, new BigNumber(hardCap).toNumber());

            // Finalize crowdsale and burn unsold tokens
            let walletBalance = new BigNumber(await token.balanceOf(wallet, {from: owner}));
            let distributedTokens = new BigNumber(await crowdsale.distributedTokens.call());
            let vestedTokens = new BigNumber(await crowdsale.vestedTokens.call());
            let soldTokens = distributedTokens.add(vestedTokens);
            var crowdsaleBalance = new BigNumber(await token.balanceOf(crowdsale.address, {from: owner}));
            var totalSupply = new BigNumber(await token.totalSupply({from: owner}));

            assert.equal(crowdsaleBalance.toNumber(), tokensToSell.sub(distributedTokens).toNumber());
            assert.equal(totalSupply.toNumber(), new BigNumber('10e27').toNumber());

            await crowdsale.closeCrowdsale({from : owner});
            await crowdsale.finalizeCrowdsale(true, {from : owner});

            // Walletbalance stays the same
            assert.equal(walletBalance.toNumber(), new BigNumber(await token.balanceOf(wallet, {from: owner})).toNumber());

            // CrowdsaleBalance only has vestedTokens, the rest is burned.
            crowdsaleBalance = new BigNumber(await token.balanceOf(crowdsale.address, {from: owner}));
            assert.equal(crowdsaleBalance.toNumber(), vestedTokens.toNumber());

            totalSupply = totalSupply.sub(tokensToSell.sub(soldTokens));
            assert.equal(totalSupply.toNumber(), new BigNumber(await token.totalSupply({from: owner})).toNumber());
        });
        it('finalizes crowdsale and does not burn unsold tokens', async function () {
            let addresses = web3.eth.accounts.slice (5, 99);
            await crowdsale.addAddressToWhitelist(addresses, {from : owner});

            // Round 1 contributions
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 1);

            addresses.slice(0, 10).map(async address => {
              await crowdsale.addPrivateSaleContributors(address , web3.toWei('110', 'ether'), {from : owner});
            });

            // Round 2 contributions
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 2);

            addresses.slice(10, 24).map(async address => {
              await crowdsale.sendTransaction({from : address, value: web3.toWei('350', 'ether')});
            });

            // Round 3 contributions
            await crowdsale.goToNextRound({from : owner});
            assert.equal(await crowdsale.currentIcoRound.call(), 3);

            addresses.slice(24, 75).map(async address => {
              return await crowdsale.sendTransaction({from : address, value: web3.toWei('29', 'ether')});
            });

            let raisedFunds = new BigNumber(await crowdsale.raisedFunds.call()).toNumber();

            // SoftCap reached
            assert.isAbove(raisedFunds, new BigNumber(softCap).toNumber());
            assert.isBelow(raisedFunds, new BigNumber(hardCap).toNumber());

            // Finalize crowdsale without burning unsold tokens
            let walletBalance = new BigNumber(await token.balanceOf(wallet, {from: owner}));
            let distributedTokens = new BigNumber(await crowdsale.distributedTokens.call());
            let vestedTokens = new BigNumber(await crowdsale.vestedTokens.call());
            let soldTokens = distributedTokens.add(vestedTokens);
            let unsoldTokens = tokensToSell.sub(soldTokens);
            let crowdsaleBalance = new BigNumber(await token.balanceOf(crowdsale.address, {from: owner}));
            let totalSupply = new BigNumber(await token.totalSupply({from: owner}));

            assert.equal(crowdsaleBalance.toNumber(), tokensToSell.sub(distributedTokens).toNumber());
            assert.equal(totalSupply.toNumber(), new BigNumber('10e27').toNumber());

            await crowdsale.closeCrowdsale({from : owner});
            await crowdsale.finalizeCrowdsale(false, {from : owner});

            // Walletbalance increased with unsoldTokens
            assert.equal(walletBalance.add(unsoldTokens).toNumber(), new BigNumber(await token.balanceOf(wallet, {from: owner})).toNumber());

            // CrowdsaleBalance only has vestedTokens, the rest is send to wallet address.
            let newCrowdsaleBalance = new BigNumber(await token.balanceOf(crowdsale.address, {from: owner}));
            assert.equal(newCrowdsaleBalance.toNumber(), vestedTokens.toNumber());

            // totalSupply stays 10B
            assert.equal(totalSupply.toNumber(), new BigNumber('10e27').toNumber());
        });
    });
});
