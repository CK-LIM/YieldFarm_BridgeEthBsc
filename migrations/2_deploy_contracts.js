const DaiToken = artifacts.require("DaiToken");
const XToken = artifacts.require("XToken");
const TokenFarm = artifacts.require("TokenFarm");
const BridgeEth = artifacts.require('BridgeEth.sol');
const BridgeBsc = artifacts.require('BridgeBsc.sol');

module.exports = async function(deployer, network, accounts ) {
  if(network === 'rinkeby' || network === 'kovan' ||network === 'development') {
    // Deploy Mock Dai Token
    await deployer.deploy(DaiToken)
    const daiToken = await DaiToken.deployed()

    //Deploy XToken
    await deployer.deploy(XToken)
    const xToken = await XToken.deployed()
  
    //Deploy TokenFarm
    await deployer.deploy(TokenFarm, xToken.address, daiToken.address, '10000000000000000000');
    const tokenFarm = await TokenFarm.deployed()
    
    // Transfer all tokens to TokenFarm (1million)
    await xToken.transfer(tokenFarm.address, '500000000000000000000000')

    // Transfer 100 Mock DAI tokens to TokenFarm
    await daiToken.transfer(tokenFarm.address, '10000000000000000000000')
    await daiToken.transfer(accounts[1], '30000000000000000000000')
//    await daiToken.transfer(accounts[2], '100000000000000000000')
//    await daiToken.transfer(accounts[3], '100000000000000000000')

    await deployer.deploy(BridgeEth, xToken.address);
    const bridgeEth = await BridgeEth.deployed();
    await xToken.updateAdmin(bridgeEth.address);
  }
  if(network === 'bscTestnet') {
    // Deploy Mock Dai Token
    await deployer.deploy(DaiToken)
    const daiToken = await DaiToken.deployed()

    //Deploy XToken
    await deployer.deploy(XToken)
    const xToken = await XToken.deployed()
  
    //Deploy TokenFarm
    await deployer.deploy(TokenFarm, xToken.address, daiToken.address, '10000000000000000000');
    const tokenFarm = await TokenFarm.deployed()
    
    // Transfer all tokens to TokenFarm (1million)
    await xToken.transfer(tokenFarm.address, '500000000000000000000000')

    // Transfer 100 Mock DAI tokens to TokenFarm
    await daiToken.transfer(tokenFarm.address, '10000000000000000000000')
    await daiToken.transfer(accounts[1], '30000000000000000000000')
    //    await daiToken.transfer(accounts[2], '100000000000000000000')

    await deployer.deploy(BridgeBsc, xToken.address);
    const bridgeBsc = await BridgeBsc.deployed();
    await xToken.updateAdmin(bridgeBsc.address);
  }
};
