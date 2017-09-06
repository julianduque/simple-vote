'use strict'

const loadContract = require('./')
const etherVote = require('./ethervote.json')
const etherVoteAddr = process.env.ETHERVOTE_ADDRESS || '0x3eaf1834d6b686f2aef0b51de18e062715ea3c2b'

module.exports = async function load () {
  const contract = await loadContract(etherVote, etherVoteAddr)
  return contract
}
