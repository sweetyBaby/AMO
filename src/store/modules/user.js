import Vue from 'vue'
import {
  ACCESS_TOKEN,
  ACCESS_MENU,
  ACCESS_USER,
  ACCESS_NUMBER
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'
import {
  login,
  getUserInfo,
  loginPhone,
  logout
} from '@/api/login'
import {
  setStore,
  clearStore
} from '@/utils/storage'
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    menuTree: {},
    userDatas: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name,
      welcome
    }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MENU: (state, menuTree) => {
      state.menuTree = menuTree
    },
    SET_USER: (state, userDatas) => {
      state.userDatas = userDatas
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        Vue.ls.set(ACCESS_NUMBER, 0)
        login(userInfo).then(response => {
          console.log(response)
          if (response.type === 'success') {
            Vue.ls.set(ACCESS_NUMBER, 1)
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            this.userDatas = {
              id: result.sysUserId,
              userName: result.userName,
              mobile: result.mobile,
              email: result.email
            }
            Vue.ls.set(ACCESS_USER, {
              id: result.sysUserId,
              userName: result.userName,
              modifyPassword: result.modifyPassword
            })
            commit('SET_USER', {
              id: result.sysUserId,
              userName: result.userName,
              modifyPassword: result.modifyPassword
            })
            resolve()
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    LoginPhone({
      commit
    }, userInfo) {
      return new Promise((resolve, reject) => {
        loginPhone(userInfo).then(response => {
          if (response.type === 'success') {
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            this.userDatas = {
              id: result.sysUserId,
              userName: result.userName,
              mobile: result.mobile,
              email: result.email
            }
            Vue.ls.set(ACCESS_USER, {
              id: result.sysUserId,
              userName: result.userName,
              modifyPassword: result.modifyPassword
            })
            commit('SET_USER', {
              id: result.sysUserId,
              userName: result.userName,
              modifyPassword: result.modifyPassword
            })
            resolve()
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        const params = Vue.ls.get(ACCESS_USER)
        getUserInfo(params).then(res => {
          const result = res.data
          // console.info('用户信息', result)
          setStore('USER_DIST_CODE', res.data.distCode)
          setStore('USER_DIST_NAME', res.data.distName)
          commit('SET_NAME', {
            name: result.userName,
            welcome: welcome()
          })
          commit('SET_INFO', result)
          Vue.ls.set(ACCESS_MENU, result.menuTree)
          commit('SET_MENU', result.menuTree)
          commit('SET_ROLES', {})
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        const params = Vue.ls.get(ACCESS_TOKEN)
        logout(params).then(res => {
          clearStore('USER_DIST_CODE')
          clearStore('USER_DIST_NAME')
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USER', {})
          commit('SET_MENU', {})
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(ACCESS_USER)
          Vue.ls.remove(ACCESS_MENU)
          resolve(res)
        })
      })
    }

  }
}

export default user
