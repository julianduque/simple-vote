'use strict'

const Vue = require('vue')
const Vuex = require('vuex')
const etherVote = require('../contracts/ethervote')
const { getAccounts, getBalance, watchBlocks } = require('../lib/ethereum')

module.exports = load

async function load () {
  const store = new Vuex.Store({
    state: {
      error: null,
      account: null,
      balance: null,
      transactions: {},
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
      updateTransaction (state, { tx, from, type, status }) {
        Vue.set(state.transactions, tx, { from, type, status })
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
      vote: async ({ commit, state }, { proposal, support }) => {
        let result
        try {
          result = await etherVote.vote(proposal, support, state.account)
          commit('updateTransaction', {
            from: state.account,
            tx: result,
            type: 'vote',
            status: 'pending'
          })
        } catch (e) {
          console.error(e)
        }
      },
      propose: async ({ commit, state }, { proposal, proposalHash }) => {
        let result
        try {
          result = await etherVote.propose(proposal, proposalHash, state.account)
          commit('updateTransaction', {
            from: state.account,
            tx: result,
            type: 'proposal',
            status: 'pending'
          })
        } catch (e) {
          console.error(e)
        }
      },
      watchVotes: async ({ commit, state }) => {
        // watch for votes
        const logVotes = await etherVote.logVote()
        logVotes.on('vote', event => {
          const { proposalHash, addr, support } = event.args

          commit('updateVote', {
            address: addr,
            proposalHash,
            support
          })

          const { transactionHash } = event
          commit('updateTransaction', {
            from: addr,
            tx: transactionHash,
            type: 'vote',
            status: 'confirmed'
          })
        })

        logVotes.on('error', err => {
          console.error(err)
        })
      },
      watchProposals: async ({ commit, state }) => {
        // watch for proposals
        const logProposals = await etherVote.logProposal()
        logProposals.on('proposal', event => {
          const { addr, proposal, proposalHash } = event.args
          commit('updateProposal', {
            proposal,
            proposalHash
          })

          const { transactionHash } = event
          commit('updateTransaction', {
            from: addr,
            tx: transactionHash,
            type: 'proposal',
            status: 'confirmed'
          })
        })

        logProposals.on('error', err => {
          console.error(err)
        })
      },
      setAccount: async ({ commit }) => {
        let accounts
        try {
          accounts = await getAccounts()
        } catch (e) {
          console.error(e)
        }

        if (!accounts || accounts.length === 0) {
          commit('updateError', 'No ethereum account found, please create one.')
          return
        }

        const account = accounts[0]
        commit('updateAccount', account)
      },
      setBalance: async ({ commit, state }) => {
        let balance
        try {
          balance = await getBalance(state.account)
          commit('updateBalance', balance)
        } catch (e) {
          console.error(e)
        }
      },
      start: async ({ dispatch, commit, state }) => {
        try {
          await etherVote.getContract()
        } catch (e) {
          commit('updateError', e.message)
          return
        }

        await dispatch('setAccount')
        await dispatch('setBalance')
        await dispatch('watchProposals')
        await dispatch('watchVotes')

        // watch for blocks
        const blocks = watchBlocks()
        blocks.on('block', async (event) => {
          // update balance
          let balance
          try {
            balance = await getBalance(state.account)
            commit('updateBalance', balance)
          } catch (e) {
            console.error(e)
          }

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

        blocks.on('error', err => {
          console.error(err)
        })
      }
    }
  })

  return store
}
