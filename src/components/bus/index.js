import Vue from 'vue'
const Bus = {}
Bus.install = function(Vue) {
  Vue.prototype.$bus = new Vue()
}
Vue.use(Bus)
