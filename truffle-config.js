require('dotenv').config();
const fs = require('fs');
const HDWalletProvider = require('@truffle/hdwallet-provider');

let keys = JSON.parse(fs.readFileSync('config.json'));

module.exports = {
  mocha: {
    enableTimeouts: 120000
  },

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" //match any network id
    },
    kovan:
    {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider({
          // mnemonic: {
          //   phrase: mnemonicPhrase
          // },
          privateKeys: [keys.privateKey],
          providerOrUrl: "wss://kovan.infura.io/ws/v3/1dd7dc4372ce47379854dad92d2abce9",
          numberOfAddresses: 1,
          shareNonce: true,
          derivationPath: "m/44'/1'/0'/0/"
        }),
      network_id: '*',
      networkCheckTimeout: 999999,
      tconfirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: keys.etherscanKey
  },
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',

  // Configure your compilers
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      version: "^0.8.0"
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: 'R93VASIPJPBCAS9Z27DSUDWX518SEY9QPK',
    bscscan: 'A2HNWK3VKZNQFAGU254HW1DAG4RPB8FI8T'
  }
};