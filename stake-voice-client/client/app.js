'use strict'

/* global web3 */

const Vue = require('vue')
const Vuex = require('vuex')
const VueMaterial = require('vue-material')
const Web3 = require('web3')
const loadStore = require('./store')
const App = require('./components/app.vue')

Vue.use(Vuex)
Vue.use(VueMaterial)
Vue.component('proposal', require('./components/proposal.vue'))
Vue.component('transactions', require('./components/transactions.vue'))
Vue.component('web3', require('./components/web3.vue'))
Vue.component('account', require('./components/account.vue'))
Vue.material.registerTheme('default', {
  primary: 'blue-grey',
  accent: 'red',
  warn: 'orange',
  background: 'white'
})

async function startApp () {
  // eslint-disable-next-line no-unused-vars
  const vm = new Vue({
    el: '#app',
    store: await loadStore(),
    render (createElement) {
      return createElement(App)
    }
  })
}

window.addEventListener('load', event => {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
  }
  startApp()
})
