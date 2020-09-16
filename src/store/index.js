import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
import { getStore } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    collapsed: false,
    wrapWidth: 0,
    invoiceInfo: getStore('EstateDetails')
  },
  mutations: {
    changeSidebar (state) {
      // console.info('state---',state)
      state.collapsed = !state.collapsed
    },
    getInvoiceInfo (state) {
      state.invoiceInfo = getStore('EstateDetails')
    }
  },
  actions: {
    changeSidebar (context) {
      context.commit('changeSidebar')
    },
    getInvoiceInfo (context) {
      context.commit('getInvoiceInfo')
    }
  },
  getters
})
