import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import {
  message
} from 'ant-design-vue'
import {
  ACCESS_TOKEN,
  ACCESS_MENU,
  ACCESS_USER
} from '@/store/mutation-types'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/amo', // api base_url
  timeout: 60000 // 请求超时时间
})

const err = (error) => {
  // console.info('error----',error.response.status)
  if (error.response.status === 403) {
    // console.info('403403403403403403403')
    store.commit('SET_TOKEN', '')
    store.commit('SET_ROLES', [])
    store.commit('SET_MENU', {})
    store.commit('SET_USER', {})
    Vue.ls.remove(ACCESS_TOKEN)
    Vue.ls.remove(ACCESS_USER)
    Vue.ls.remove(ACCESS_MENU)
    window.location.href = '/user/login'
  }
  if (error.response) {
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 404 || error.response.status === 500) {
      message.error(error.response.data.message)
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const urlList = config.url.split('/')
  if (urlList.findIndex(item => item === 'auth') > -1) {
    config.baseURL = '/auth'
    // debugger
  }
  const token = Vue.ls.get(ACCESS_TOKEN)
  // const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE1NjQ1NDIyODQzMjEsImV4cCI6MTU2NDYyODY4NH0.MxcY_9aYtz42cIwHgrYy18cnSWJgFgMf0D2vPNXDFg5I2KncUHoUrbNvzY9iISODKXATHJLsiSCNMFSaxAitSg'
  if (token) {
    // config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    config.headers['Authorization'] = 'Bearer ' + token
  }
  // console.info('config=-----', config)
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  // console.info('response',response)
  // 更新token
  if (response.data.token) {
    Vue.ls.set(ACCESS_TOKEN, response.data.token)
  }
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
