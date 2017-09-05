'use strict'

/* global web3 */

module.exports = loadContract

function getCode (addr) {
  return new Promise((resolve, reject) => {
    web3.eth.getCode(addr, (err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}

async function loadContract (contract, addr) {
  if (typeof web3 === 'undefined') {
    throw new Error('web3 instance not found')
  }

  const code = await getCode(addr)
  if (!code || code.length < 3) {
    throw new Error(`Contract ${contract.contract_name} doesn't exist in address ${addr}`)
  }

  const Contract = web3.eth.contract(contract.abi)
  return Contract.at(addr)
}
