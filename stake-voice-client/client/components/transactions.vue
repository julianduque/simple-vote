<style>

</style>

<template>
  <div>
    <table>
      <tr>
        <th>From</th><th>Transaction</th><th>Type</th><th>Status</th>
      </tr>
      <tr v-for="(tx, transactionHash) in transactions" :key="transactionHash">
        <td>{{tx.from}}</td><td>{{transactionHash}}</td><td>{{tx.type}}</td><td>{{tx.status}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
const { mapState } = require('vuex')

module.exports = {
  computed: mapState({
    transactions: state => state.transactions
  })
}
</script>
