<style></style>

<template>
  <div>
    <p v-if="error">{{error}}</p>
    <input type="text" v-model="proposal">
    <button @click="send">Propose</button>
    <account></account>
    <web3></web3>
    <transactions></transactions>
    <proposal
      v-for="(p, hash) in proposals"
      :key="hash"
      :hash="hash"></proposal>
  </div>
</template>

<script>
const crypto = require('crypto')
const { mapState } = require('vuex')

module.exports = {
  name: 'app',
  computed: mapState({
    error: state => state.error,
    proposals: state => state.proposals
  }),
  methods: {
    send () {
      const { proposal } = this
      const proposalHash = crypto.createHash('md5').update(proposal).digest('hex')
      this.$store.dispatch('propose', { proposal, proposalHash })
      this.proposal = ''
    }
  },
  data () {
    return {
      proposal: ''
    }
  },
  mounted () {
    this.$store.dispatch('start')
  }
}
</script>

