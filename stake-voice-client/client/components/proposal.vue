<style>

</style>

<template>
  <div>
    <h3>{{proposal}}</h3>
    <button @click="support">Support</button>
    <button @click="against">Against</button>
    <p>Total Support: {{total.support}}</p>
    <p>Total Against: {{total.against}}</p>
    <p>Total Votes: {{total.votes}}</p>
  </div>
</template>


<script>
const { mapState } = require('vuex')

module.exports = {
  props: [ 'hash' ],
  computed: {
    proposal () {
      return this.$store.state.proposals[this.hash]
    },

    total () {
      return this.$store.state.totals[this.hash] || { support: 0, votes: 0, against: 0 }
    }
  },
  filters: {
    zero (val) {
      return val || 0
    }
  },
  methods: {
    support () {
      this.vote(true)
    },

    against () {
      this.vote(false)
    },

    vote (support) {
      const proposal = this.hash
      this.$store.dispatch('vote', { proposal, support })
    }
  }
}
</script>
