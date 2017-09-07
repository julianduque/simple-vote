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
      version: null
    }
  },
  methods: {
    updateNotice (notice) {
      this.$store.commit('updateNotice', notice)
    }
  },
  mounted () {
    if (typeof web3 === 'undefined') {
      this.updateNotice('No web3 instance found, please use a supported browser (MetaMask, Mist)')
      return
    }

    this.version = web3.version.api
  }
}
</script>

