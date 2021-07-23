const Web3 = require('web3');
const XToken = artifacts.require('XToken')
const LPXToken = artifacts.require('LPXToken')
const TokenFarm = artifacts.require('TokenFarm')

const Prikeys = ['8e6be4d7056eb2a4eba24a407f6ddd735e408187f8596ef5c3be00efc7a35935',
    'fee5d041188b2e4020492e007886ec694e3fb9ba1ba005311cb298ea55e06232',
    'b397c127f27744f90ffd55f9a9a08eb25e7bb211838b046d6893f55f3d59ec2f',
    '5f00a17192e03ec0fb8237d21c3dfc69aaf1ef6fbd7180091c1f8a4b9443bf0f',
    '80f2aa872eebb4588bef54dfc315295e484226ec144b45a4fe76999bf8f140f9']

let accounts = [];
let index = 5

for (let i = 0; i < index; i++) {
    const { address: account } = web3Eth.eth.accounts.wallet.add(Prikeys[i]);
    accounts[i] = account;
    console.log(accounts[i])
}

function tokens(n) {
    return web3.utils.toWei(n,'ether');
}

function wei(n) {
    return web3.utils.fromWei(n,'ether');
}

module.exports = async function (callback) {
    let xToken = await XToken.deployed()
    let lpXToken = await LPXToken.deployed()
    let tokenFarm = await TokenFarm.deployed()
    // let account = await web3.eth.personal.getAccounts()
    // console.log(account)
    // let accounts = await web3.eth.getAccounts()
    // console.log(accounts[0])
    result = await xToken.balanceOf(accounts[0])
    console.log(wei(result))

    for (let i = 1; i < index; i++) {
        lpXTokenBalance = await lpXToken.balanceOf(accounts[i])
        await lpXToken.approve(tokenFarm.address, tokens(lpXTokenBalance), { from: accounts[i] })
        await tokenFarm.emergencyUnstakeTokens({ from: accounts[i] })
        console.log('user'+i+' done unstaking')
        result = await xToken.balanceOf(accounts[i])
        console.log(wei(result))
    }
    callback()
}