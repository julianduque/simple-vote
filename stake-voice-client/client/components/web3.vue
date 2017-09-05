<style></style>

<template>
  <div>
    <p v-if="version">Web3: {{version}}</p>
  </div>
</template>

<script>
module.exports = {
  data () {
    return {
      version: null
    }
  },
  methods: {
    updateError (err) {
      this.$store.commit('updateError', err)
    }
  },
  mounted () {
    if (typeof web3 === 'undefined') {
      this.updateError('No web3 instance found, please use a supported browser (MetaMask, Mist)')
      return
    }

    this.version = web3.version.api
  }
}
</script>

