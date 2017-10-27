'use strict'

const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = 'put your metamask seed words here'
const infuraApiKey = 'your infura api key here'

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 2100000,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost",
      port: 8545,
      from: "0x2db9d640ff06a8f3c9f1017200b2db04586917b8",
      network_id: 4,
      gas: 4612388
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApiKey}`),
      network_id: 3,
      gas: 4612388
    }
  }
}
