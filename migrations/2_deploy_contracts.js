const LpXToken = artifacts.require("LpXToken.sol");
const XToken = artifacts.require("XToken.sol");
const PurseToken = artifacts.require("PurseToken.sol")
const TokenFarm = artifacts.require("TokenFarm.sol");
const BridgeEth = artifacts.require('BridgeEth.sol');
const BridgeBsc = artifacts.require('BridgeBsc.sol');

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

module.exports = async function(deployer, network, accounts ) {
  if(network === 'rinkeby' || network === 'kovan' ||network === 'development') {
    // Deploy Mock Dai Token
    await deployer.deploy(LpXToken)
    const lpXToken = await LpXToken.deployed()

    //Deploy XToken
    await deployer.deploy(XToken)
    const xToken = await XToken.deployed()

    //Deploy PurseToken
    await deployer.deploy(PurseToken)
    const purseToken = await PurseToken.deployed()
  
    //Deploy TokenFarm
    await deployer.deploy(TokenFarm, xToken.address, lpXToken.address, purseToken.address, tokens('10'))
    const tokenFarm = await TokenFarm.deployed()
    
    // Transfer all purse tokens to TokenFarm
    await purseToken.transfer(tokenFarm.address, tokens('1000000'))
    console.log('Purse done')

    //Deploy BridgeEth contract
    await deployer.deploy(BridgeEth, purseToken.address);
    const bridgeEth = await BridgeEth.deployed();
    await purseToken.updateAdmin(bridgeEth.address);
    
    // Transfer all lpX tokens to TokenFarm (1million)
    await lpXToken.transfer(tokenFarm.address, tokens('1000000'))
    console.log('lpX done')

    // Transfer 100 Mock X tokens to TokenFarm
    // await xToken.transfer(tokenFarm.address, tokens('10000'))
    // console.log('X1 done')
    await xToken.transfer(accounts[1], tokens('5000'))
    console.log('X2 done')
    // await xToken.transfer(accounts[2], tokens('5000'))
//    await xToken.transfer(accounts[3], tokens('5000'))


  }

  if(network === 'bscTestnet') {

    //Deploy PurseToken
    // Deploy Mock Dai Token
    await deployer.deploy(LpXToken)
    const lpXToken = await LpXToken.deployed()

    //Deploy XToken
    await deployer.deploy(XToken)
    const xToken = await XToken.deployed()
    
    //Deploy PurseToken
    await deployer.deploy(PurseToken)
    const purseToken = await PurseToken.deployed()

    //Deploy TokenFarm
    await deployer.deploy(TokenFarm, xToken.address, lpXToken.address, purseToken.address, tokens('10'))
    const tokenFarm = await TokenFarm.deployed()

    await deployer.deploy(BridgeBsc, purseToken.address);
    const bridgeBsc = await BridgeBsc.deployed();
    await purseToken.updateAdmin(bridgeBsc.address);
  }
};
