import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: parameter
  })
}

export function loginPhone (parameter) {
  return axios({
    url: '/auth/mobileLogin',
    method: 'post',
    data: parameter
  })
}
// export function getSmsCaptcha (parameter) {
//   return axios({
//     url: api.SendSms,
//     method: 'post',
//     data: parameter
//   })
// }
// 获取用户信息
export function getSmsCaptcha (parameter) {
  // console.info('---',parameter)
  // debugger
  return axios({
    url: '/auth/verificationCode',
    method: 'post',
    data: parameter
  })
}

export function updatePasswordByMobile (parameter) {
  return axios({
    url: '/auth/updatePasswordByMobile',
    method: 'post',
    data: parameter
  })
}
// 获取用户信息
export function getUserInfo () {
  return axios({
    url: 'user/loginInfo',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: 'auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}
