import Web3 from 'web3'
import React, { Component } from 'react'
import Navbar from './Navbar'
import LpXToken from '../abis/LpXToken.json'
import XToken from '../abis/XToken.json'
import PurseToken from '../abis/PurseToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import BridgeEth from '../abis/BridgeEth.json'
import BridgeBsc from '../abis/BridgeBsc.json'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    console.log(window.web3)
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)

    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    this.setState({ networkId: networkId })

    // Load XToken
    const xTokenData = XToken.networks[networkId]
    console.log(xTokenData)
    if (xTokenData) {
      const xToken = new web3.eth.Contract(XToken.abi, xTokenData.address)
      this.setState({ xToken })
      let xTokenBalance = await xToken.methods.balanceOf(this.state.account).call()
      this.setState({ xTokenBalance: xTokenBalance.toString() })
      console.log({ xbalance: window.web3.utils.fromWei(xTokenBalance, 'Ether') })
    } else {
      window.alert('XToken contract not deployed to detected network.')
    }

    // Load LpXToken
    const lpXTokenData = LpXToken.networks[networkId]
    console.log(lpXTokenData)
    if (lpXTokenData) {
      const lpXToken = new web3.eth.Contract(LpXToken.abi, lpXTokenData.address)
      this.setState({ lpXToken })
      console.log(this.state.lpXToken)
      let lpXTokenBalance = await lpXToken.methods.balanceOf(this.state.account).call()
      const tokenFarmData = TokenFarm.networks[networkId]
      let lpXTokenBalance_farm = await lpXToken.methods.balanceOf(tokenFarmData.address).call()
      this.setState({ lpXTokenBalance: lpXTokenBalance.toString() })
      this.setState({ lpXTokenBalance_farm: lpXTokenBalance_farm.toString() })
      console.log({ lpXbalance: window.web3.utils.fromWei(lpXTokenBalance, 'Ether') })
      console.log({ lpXbalance_farm: window.web3.utils.fromWei(lpXTokenBalance_farm, 'Ether') })
    } else {
      window.alert('LpXToken contract not deployed to detected network.')
    }

    // Load PurseToken
    const purseTokenData = PurseToken.networks[networkId]
    console.log(purseTokenData)
    if (purseTokenData) {
      const purseToken = new web3.eth.Contract(PurseToken.abi, purseTokenData.address)
      this.setState({ purseToken })
      let purseTokenBalance = await purseToken.methods.balanceOf(this.state.account).call()
      this.setState({ purseTokenBalance: purseTokenBalance.toString() })
      console.log({ pursebalance: window.web3.utils.fromWei(purseTokenBalance, 'Ether') })
    } else {
      window.alert('PurseToken contract not deployed to detected network.')
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    console.log(tokenFarmData)
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })

      let stakerInfo = await tokenFarm.methods.stakerInfo(this.state.account).call()
      this.setState({ stakerInfo })
      console.log({ stakerInfo: stakerInfo })

      let farmInfo = await tokenFarm.methods.farmInfo().call()
      this.setState({ farmInfo })
      console.log({ farmInfo: farmInfo })

    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }
    this.setState({ loading: false })

    if (networkId == 4) {
      // Load BridgeEth
      const bridgeEthData = BridgeEth.networks[networkId]
      console.log(bridgeEthData)
      if (bridgeEthData) {
        const bridgeEth = new web3.eth.Contract(BridgeEth.abi, bridgeEthData.address)
        this.setState({ bridgeEth })
      } else {
        window.alert('BridgeEth contract not deployed to detected network.')
      }
      console.log('4ethbsc')
      this.setState({ loading: false })
    } else if (networkId == 97) {
      console.log('97ethbsc')
      // Load BridgeEth
      const bridgeBscData = BridgeBsc.networks[networkId]
      console.log(bridgeBscData)
      if (bridgeBscData) {
        const bridgeBsc = new web3.eth.Contract(BridgeBsc.abi, bridgeBscData.address)
        this.setState({ bridgeBsc })
      } else {
        window.alert('BridgeBsc contract not deployed to detected network.')
      }
      this.setState({ loading: false })
    }

  }

  async loadWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // Request account access if needed
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    // Non-dapp browsers...
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }


  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.xToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.lpXToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  emergencyUnstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.lpXToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.emergencyUnstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  transferOwnership = (address, amount) => {
    this.setState({ loading: true })
    this.state.lpXToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.transferOwnership(address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  updateRewardTokens = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.updateRewardTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  redeemToken = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.redeemToken(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  bridgeEthBscTransfer = (address, amount, nonce, signature) => {
    this.setState({ loading: true })
    if (this.state.networkId == 4) {
      this.state.bridgeEth.methods.burn(address, amount, nonce, signature).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    } else if (this.state.networkId == 97) {
      this.state.bridgeBsc.methods.burn(address, amount, nonce, signature).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    }
  }

  signMessage = async (address, amount, nonce) => {
    console.log(address);
    console.log(amount);
    console.log(nonce);
    const message = window.web3.utils.soliditySha3(
      { t: 'address', v: this.state.account },
      { t: 'address', v: address },
      { t: 'uint256', v: amount },
      { t: 'uint256', v: nonce },
    ).toString('hex');
    console.log(message);
    let signature = await window.web3.eth.sign(message, this.state.account)
    console.log(signature)
    this.bridgeEthBscTransfer(address, amount, nonce, signature)
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      xToken: {},
      lpXToken: {},
      purseToken: {},
      tokenFarm: {},
      bridgeEth: {},
      xTokenBalance: '0',
      lpXTokenBalance: '0',
      lpXTokenBalance_farm: '0',
      purseTokenBalance: '0',
      stakerInfo: '0',
      farmInfo: '0',
      loading: true
    }
  }

  render() {
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        account={this.state.account}
        xTokenBalance={this.state.xTokenBalance}
        lpXTokenBalance={this.state.lpXTokenBalance}
        lpXTokenBalance_farm={this.state.lpXTokenBalance_farm}
        purseTokenBalance={this.state.purseTokenBalance}
        stakerInfo={this.state.stakerInfo}
        farmInfo={this.state.farmInfo}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        emergencyUnstakeTokens={this.emergencyUnstakeTokens}
        transferOwnership={this.transferOwnership}
        updateRewardTokens={this.updateRewardTokens}
        redeemToken={this.redeemToken}
        bridgeEthBscTransfer={this.bridgeEthBscTransfer}
        signMessage={this.signMessage}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '800px' }}>
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
