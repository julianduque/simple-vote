<style>

</style>

<template>
  <div>
    <md-table-card>
      <md-toolbar>
        <h2 class="md-title">Transactions</h2>
      </md-toolbar>
      <md-table>
        <md-table-header>
          <md-table-row>
            <md-table-head>From</md-table-head>
            <md-table-head>Transaction</md-table-head>
            <md-table-head>Type</md-table-head>
            <md-table-head>Status</md-table-head>
          </md-table-row>
        </md-table-header>
        <md-table-body>
          <md-table-row v-for="(tx, transactionHash) in transactions" :key="transactionHash">
            <md-table-cell>{{tx.from}}</md-table-cell>
            <md-table-cell>{{transactionHash}}</md-table-cell>
            <md-table-cell>{{tx.type}}</md-table-cell>
            <md-table-cell>{{tx.status}}</md-table-cell>
          </md-table-row>
        </md-table-body>
      </md-table>
       <md-table-pagination
        md-size="5"
        md-page="1"
        :md-total="total"
        md-label="Rows"
        md-separator="of"
        :md-page-options="[5, 10, 15]"
        @pagination="onPagination">
      </md-table-pagination>
    </md-table-card>
  </div>
</template>

<script>
const { mapState } = require('vuex')

module.exports = {
  data () {
    return {
      size: 5,
      page: 1
    }
  },
  computed: mapState({
    transactions (state) {
      const transactions = {}
      const keys = Object.keys(state.transactions).slice((this.page - 1) * this.size, this.page * this.size)
      keys.forEach(k => {
        transactions[k] = state.transactions[k]
      })
      return transactions
    },
    total: state => Object.keys(state.transactions).length
  }),
  methods: {
    onPagination ({ size, page }) {
      this.size = size
      this.page = page
    }
  }
}
</script>
