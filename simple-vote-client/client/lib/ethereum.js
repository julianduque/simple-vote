'use strict'

/* global web3 */

const EventEmitter = require('events')

function getCode (addr) {
  return new Promise((resolve, reject) => {
    web3.eth.getCode(addr, (err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}

function getAccounts () {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      if (err) return reject(err)

      resolve(accounts)
    })
  })
}

function getBalance (addr, unit = 'ether') {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(addr, (err, balance) => {
      if (err) return reject(err)

      balance = Number(web3.fromWei(balance, unit))
      resolve(balance)
    })
  })
}

async function loadContract (contract, addr) {
  if (typeof web3 === 'undefined') {
    throw new Error('No web3 instance found, please use a supported browser (MetaMask, Mist)')
  }

  const code = await getCode(addr)
  if (!code || code.length < 3) {
    throw new Error(`Contract ${contract.contract_name} doesn't exist in address ${addr}`)
  }

  const Contract = web3.eth.contract(contract.abi)
  return Contract.at(addr)
}

function watchBlocks (filter = 'latest') {
  const emitter = new EventEmitter()

  web3.eth.filter(filter).watch((err, result) => {
    if (err) return emitter.emit('error', err)

    emitter.emit('block', result)
  })

  return emitter
}

module.exports = {
  loadContract,
  getAccounts,
  getBalance,
  watchBlocks,
  getCode
}
