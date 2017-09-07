<style>
  .md-row {
    margin-bottom: 5px;
  }
</style>
<template>
  <md-card md-with-hover>
    <md-card-area>
      <md-card-header>
        <div class="md-title">{{proposal}}</div>
      </md-card-header>
      <md-card-content>
        <md-layout md-column>
          <md-layout md-row>
            <md-layout>
              <span class="md-body-2">Support:</span>
            </md-layout>
            <md-chip class="md-primary">{{total.support}}</md-chip>
          </md-layout>
          <md-layout md-row>
            <md-layout>
              <span class="md-body-2">Against:</span>
            </md-layout>
            <md-chip class="md-accent">{{total.against}}</md-chip>
          </md-layout>
          <md-layout md-row>
            <md-layout>
              <span class="md-body-2">Total Votes:</span>
            </md-layout>
            <md-chip>{{total.votes}}</md-chip>
          </md-layout>
        </md-layout>
      </md-card-content>
    </md-card-area>
    <md-card-actions>
      <md-button @click="support" class="md-icon-button md-raised md-primary">
        <md-icon>thumb_up</md-icon>
        <md-tooltip md-direction="top">Support</md-tooltip>
      </md-button>
      <md-button @click="against" class="md-icon-button md-raised md-accent">
        <md-icon>thumb_down</md-icon>
        <md-tooltip md-direction="top">Against</md-tooltip>
      </md-button>
    </md-card-actions>
  </md-card>
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
