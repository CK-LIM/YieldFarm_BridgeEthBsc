const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "b1184950e54f48c4929d27d11a762ed4";
// const infuraKey = "4f60244fe0ed4c24976d4bedbaf22222";
// const infuraKey = "bab6cd4ea2c34ef287fdec1424e20c1f";
// const infuraKey = "6dbe369fdc4848f18226ada23a825c5e";
const infuraKey = "f8814e0ae79f47f1a4d4d9df00b57e79";
// const infuraKey = "abd5597872984160baacce0fb852267e";

const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      // gas: 3000000,
      // gasPrice: 20000000000,
      // gasLimit: 5673399
    },
    rinkeby: {
      provider: () => new HDWalletProvider(
        mnemonic,
        // `https://rinkeby.infura.io/v3/${infuraKey}`,0, 2000),
        `wss://rinkeby.infura.io/ws/v3/${infuraKey}`,0,2000),
      network_id: 4,
      gas: 3000000,
      gasPrice: 20000000000,
      confirmations: 0,
      networkCheckTimeout: 100000000,
      timeoutBlocks: 40000,
      skipDryRun: true
    },
    kovan: {
      provider: () => new HDWalletProvider(
        mnemonic,
        `https://kovan.infura.io/v3/${infuraKey}`),
      network_id: 42,
      gas: 4000000,
      gasPrice: 20000000000,
      confirmations: 1,
      timeoutBlocks: 500,
      skipDryRun: true
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        `https://data-seed-prebsc-1-s1.binance.org:8545/`),
      network_id: 97,
      gas: 3000000,
      gasPrice: 20000000000,
      confirmations: 0,
      timeoutBlocks: 400,
      skipDryRun: true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
