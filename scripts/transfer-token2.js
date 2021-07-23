const Web3 = require('web3');
const XToken = artifacts.require('XToken')
const TokenFarm = artifacts.require('TokenFarm')
const LPXToken = artifacts.require('LPXToken')

const infuraKey = "4f60244fe0ed4c24976d4bedbaf22222";
const web3Eth = new Web3(`https://rinkeby.infura.io/v3/${infuraKey}`);            // http provider not supported 

const Prikeys = ['54dad62968e13d682a4d01884cbedb95835dbd2d72cee7063d6e9e92558ee8a4',
'462881c0be15d04ec317122577c5a51048ecd173221a3b4b480d91d8d2ff1028',
'491d8b7c22be370ed4d3a9e79bfc09d587077d2e35f942a462af441c30c5fb8f',
    '42770ce3e52b811dabad628d18fa73b831d736ed9eda5d59b5352975e7837600',
    '8e6be4d7056eb2a4eba24a407f6ddd735e408187f8596ef5c3be00efc7a35935',
    'fee5d041188b2e4020492e007886ec694e3fb9ba1ba005311cb298ea55e06232',
    'b397c127f27744f90ffd55f9a9a08eb25e7bb211838b046d6893f55f3d59ec2f',
    '5f00a17192e03ec0fb8237d21c3dfc69aaf1ef6fbd7180091c1f8a4b9443bf0f',
    '80f2aa872eebb4588bef54dfc315295e484226ec144b45a4fe76999bf8f140f9'
]

let accounts = [];
let index = 3

for (let i = 0; i < index; i++) {
    const { address: account } = web3Eth.eth.accounts.wallet.add(Prikeys[i]);
    accounts[i] = account;
    console.log(accounts[i])
}

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

function wei(n) {
    return web3.utils.fromWei(n, 'ether');
}

module.exports = async function (callback) {
    let xToken = await XToken.deployed()
    let lpXToken = await LPXToken.deployed()
    let tokenFarm = await TokenFarm.deployed()

    // Transfer token part
    for (let i = 1; i < index; i++) {
        result = await xToken.balanceOf(accounts[0])
        console.log(wei(result))
        await xToken.transfer(accounts[i], tokens('10'))
        console.log('accounts' +i+ ' done transfer')
        result = await xToken.balanceOf(accounts[i])
        console.log('xToken account' + i + ':' + wei(result))
    }

    // Staking token part
    for (let i = 1; i < index; i++) {
        await xToken.approve(tokenFarm.address, tokens('10'), { from: accounts[i] })
        await tokenFarm.stakeTokens(tokens('10'), { from: accounts[i] })
        console.log('accounts' + i + ' done staking')
    }

    // Extract stakerInfo data
    for (let i = 1; i < index; i++) {
        stakerInfo = await tokenFarm.stakerInfo(accounts[i])
        console.log('Staking Balance account' + i + ': ' + wei(stakerInfo.stakingBalance))
        console.log('Reward Balance account' + i + ': ' + wei(stakerInfo.rewardBalance))
        console.log('Pool Share Ratio account' + i + ': ' + stakerInfo.poolShareRatio.toString())
    }


    callback()
}