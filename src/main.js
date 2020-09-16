// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import VCharts from 'v-charts'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import '@/assets/iconfont/iconfont.css'
import '@/assets/commonless/common.less'

// 引入时间插件
import moment from 'moment'
// bus通信
import '@/components/bus'

Vue.config.productionTip = false
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(VCharts)

Vue.filter('dateFormat', (dateStr, pattern = 'YYYY-MM-DD') => {
  if (dateStr) {
    return moment(dateStr).format(pattern)
  }
  return dateStr
})
new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
