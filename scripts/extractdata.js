const XToken = artifacts.require('XToken')
const TokenFarm = artifacts.require('TokenFarm')
const LPXToken = artifacts.require('LPXToken')

// const Prikeys = ['8e6be4d7056eb2a4eba24a407f6ddd735e408187f8596ef5c3be00efc7a35935',
//     'fee5d041188b2e4020492e007886ec694e3fb9ba1ba005311cb298ea55e06232',
//     'b397c127f27744f90ffd55f9a9a08eb25e7bb211838b046d6893f55f3d59ec2f',
//     '5f00a17192e03ec0fb8237d21c3dfc69aaf1ef6fbd7180091c1f8a4b9443bf0f',
//     '80f2aa872eebb4588bef54dfc315295e484226ec144b45a4fe76999bf8f140f9']

// let accounts = [];

let start = 148
let index = 151

// for (let i = 0; i < index; i++) {
//     const { address: account } = web3Eth.eth.accounts.wallet.add(Prikeys[i]);
//     accounts[i] = account;
//     console.log(accounts[i])
// }

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
    let accounts = await web3.eth.getAccounts()
    console.log('address account[0]'+accounts[0])
    // result = await xToken.balanceOf(accounts[0])
    // console.log('xToken account[0]:'+ wei(result))

    // Extract stakerInfo data
    for (let i = start; i < index; i++) {
        stakerInfo = await tokenFarm.stakerInfo(accounts[i])
        console.log('address account'+i+accounts[i])
        console.log('Staking Block account'+i+': ' +stakerInfo.stakingBlock)
        // console.log('Reward Balance account'+i+': '+wei(stakerInfo.rewardBalance))
        // console.log('Pool Share Ratio account'+i+': '+stakerInfo.poolShareRatio.toString())
    }
    callback()
}