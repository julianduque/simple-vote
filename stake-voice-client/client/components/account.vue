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
    account: state => state.account,
    balance: state => state.balance
  })
}
</script>
