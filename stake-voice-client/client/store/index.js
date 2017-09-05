'use strict'

/* global web3 */

const Vue = require('vue')
const Vuex = require('vuex')
const loadEthervote = require('../contracts/ethervote')

module.exports = load

async function load () {
  let etherVote

  const store = new Vuex.Store({
    state: {
      error: null,
      account: null,
      balance: null,
      proposals: {},
      votes: {},
      totals: {}
    },
    mutations: {
      updateError (state, error) {
        state.error = error
      },
      updateAccount (state, account) {
        state.account = account
      },
      updateBalance (state, balance) {
        state.balance = balance
      },
      updateProposal (state, { proposal, proposalHash }) {
        Vue.set(state.proposals, proposalHash, proposal)
      },
      updateVote (state, { proposalHash, address, support }) {
        if (!state.votes[proposalHash]) {
          Vue.set(state.votes, proposalHash, {})
        }

        Vue.set(state.votes[proposalHash], address, support)
      },
      updateTotal (state, { proposalHash, total }) {
        Vue.set(state.totals, proposalHash, total)
      }
    },
    actions: {
      vote ({ state }, { proposal, support }) {
        etherVote.vote(proposal, support, { from: state.account }, (err, result) => {
          if (err) return console.error(err)
          console.log(result)
        })
      },
      propose ({ state }, { proposal, proposalHash }) {
        etherVote.propose(proposal, proposalHash, { from: state.account }, (err, result) => {
          if (err) return console.error(err)
          console.log(result)
        })
      },
      watch: async ({ commit, state }) => {
        try {
          etherVote = await loadEthervote()
        } catch (e) {
          commit('updateError', e.message)
          return
        }

        const logFilter = {
          fromBlock: 0,
          toBlock: 'latest'
        }

        // watch for proposals
        const logProposals = etherVote.LogProposal({}, logFilter)
        logProposals.watch((err, event) => {
          if (err) return console.error(err)

          const { proposal, proposalHash } = event.args
          commit('updateProposal', {
            proposal,
            proposalHash
          })
        })

        // watch for votes
        const logVotes = etherVote.LogVote({}, logFilter)

        logVotes.watch((err, event) => {
          if (err) return console.error(err)

          const { proposalHash, addr, support } = event.args

          commit('updateVote', {
            address: addr,
            proposalHash,
            support
          })
        })

        // watch for blocks
        web3.eth.filter('latest').watch((err, result) => {
          if (err) return console.error(err)

          // update balance
          web3.eth.getBalance(state.account, (err, balance) => {
            if (err) return console.error(err)

            balance = Number(web3.fromWei(balance, 'ether'))

            commit('updateBalance', balance)
          })

          // totalize votes
          Object.keys(state.votes).forEach(proposalHash => {
            const votes = state.votes[proposalHash]
            const addresses = Object.keys(votes)
            const total = {
              support: 0,
              against: 0,
              votes: addresses.length
            }

            addresses.forEach(address => {
              if (votes[address]) {
                total.support++
              } else {
                total.against++
              }
            })

            commit('updateTotal', { proposalHash, total })
          })
        })
      }
    }
  })

  return store
}
