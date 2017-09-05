<style></style>

<template>
  <div>
    <p v-if="account">Address: {{account}}</p>
    <p v-if="balance">Balance: {{balance}}</p>
  </div>
</template>

<script>
const { mapState } = require('Vuex')

module.exports = {
  computed: mapState({
    error: state => state.error,
    account: state => state.account,
    balance: state => state.balance
  }),
  methods: {
    updateError (err) {
      this.$store.commit('updateError', err)
    },
    updateAccount (account) {
      this.$store.commit('updateAccount', account)
    },
    updateBalance (balance) {
      this.$store.commit('updateBalance', balance)
    }
  },
  mounted () {
    web3.eth.getAccounts((err, accounts) => {
      if (err || accounts.length === 0) {
        this.updateError('No ethereum account found, please create one')
        return
      }

      const account = accounts[0]
      this.updateAccount(account)

      web3.eth.getBalance(account, (err, balance) => {
        if (err) {
          this.updateError(err.message)
          return
        }

        balance = Number(web3.fromWei(balance, 'finney'))
        this.updateBalance(balance)
      })
    })
  }
}
</script>
