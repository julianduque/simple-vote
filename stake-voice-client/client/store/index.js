'use strict'

const Vue = require('vue')
const Vuex = require('vuex')
const etherVote = require('../contracts/ethervote')
const { getAccounts, getBalance, watchBlocks } = require('../lib/ethereum')

module.exports = load

async function load () {
  const store = new Vuex.Store({
    state: {
      notice: null,
      account: null,
      balance: null,
      transactions: {},
      proposals: {},
      votes: {},
      totals: {}
    },
    mutations: {
      updateNotice (state, notice) {
        state.notice = notice
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
          commit('updateNotice', e.message)
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
          commit('updateNotice', e.message)
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
          commit('updateNotice', err.message)
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
          commit('updateNotice', err.message)
        })
      },
      setAccount: async ({ commit }) => {
        let accounts
        try {
          accounts = await getAccounts()
        } catch (e) {
          commit('updateNotice', e.message)
        }

        if (!accounts || accounts.length === 0) {
          commit('updateNotice', 'No ethereum account found, please create one.')
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
          commit('updateNotice', e.message)
        }
      },
      totalizeVotes ({ commit, state }) {
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
      },
      start: async ({ dispatch, commit, state }) => {
        try {
          await etherVote.getContract()
        } catch (e) {
          commit('updateNotice', e.message)
          return
        }

        await dispatch('setAccount')
        await dispatch('setBalance')
        await dispatch('watchProposals')
        await dispatch('watchVotes')
        await dispatch('totalizeVotes')

        // watch for blocks
        const blocks = watchBlocks()
        blocks.on('block', async (event) => {
          // update balance
          let balance
          try {
            balance = await getBalance(state.account)
            commit('updateBalance', balance)
          } catch (e) {
            commit('updateNotice', e.message)
          }

          await dispatch('totalizeVotes')
        })

        blocks.on('error', err => {
          commit('updateNotice', err.message)
        })
      }
    }
  })

  return store
}
