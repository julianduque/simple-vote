<template>
  <md-layout v-if="version" md-row>
    <md-layout>
      <span class="md-body-2">Web3:</span>
    </md-layout>
    <md-chip>v{{version}}</md-chip>
  </md-layout>
</template>

<script>

module.exports = {
  data () {
    return {
      version: null,
    }
  },
  mounted () {
    if (typeof web3 !== 'undefined') {
      this.version = web3.version.api
    }
  }
}
</script>

