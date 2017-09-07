<template>
  <md-layout md-column>
    <md-layout v-if="account" md-row>
      <md-layout>
        <span class="md-body-2">Address:</span>
      </md-layout>
      <md-chip>{{account}}</md-chip>
    </md-layout>
    <md-layout v-if="balance" md-row>
      <md-layout>
        <span class="md-body-2">Balance:</span>
      </md-layout>
      <md-chip>{{balance}}</md-chip>
    </md-layout>
  </md-layout>
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
