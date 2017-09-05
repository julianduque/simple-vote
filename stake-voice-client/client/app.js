'use strict'

/* global web3 */

const Vue = require('vue')
const Vuex = require('vuex')
const VueRouter = require('vue-router')
const Web3 = require('web3')
const loadStore = require('./store')
const App = require('./components/app.vue')

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.component('proposal', require('./components/proposal.vue'))
Vue.component('web3', require('./components/web3.vue'))
Vue.component('account', require('./components/account.vue'))

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
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  startApp()
})
