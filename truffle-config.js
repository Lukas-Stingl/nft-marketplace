require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const privateKeys = process.env.PRIVATE_KEYS || "";

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
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          privateKeys.split(','), // array of private keys
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}` // Url to an Ethereum node
        )
      },
      gas:      6500000,
      gasPrice: 10000000000,
      network_id: 4,
      networkCheckTimeout: 120000,
      timeoutBlocks: 200,
      confirmations: 5,
      skipDryRun: true
    }
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