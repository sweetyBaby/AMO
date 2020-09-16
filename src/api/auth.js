import { axios } from '@/utils/request'

const api = {
  login: 'auth/login',
  getUserList: 'user/getUserList',
  getLoginMenu: 'sys/menu/getLoginMenuTree',
  getAccount: 'user/genAccount',
  checkAccount: 'user/checkAccount',
  userGetRole: 'sys/role/selectList',
  addUser: 'user/addUser',
  useDisable: 'user/changeStatus',
  getUserCode: 'user/getUserInfo',
  editUser: 'user/updateUser',
  deletUser: 'user/delete',
  getAuthCode: 'auth/getAuthCode',
  resetByMobile: 'auth/resetByMobile',
  getUserDetail: 'auth/info',
  checkMobile: 'user/checkMobile',
  modifyUserPhone: '/user/modifyUserPhone',
  modifyUserInfo: '/user/modifyUserInfo',
  permissionsLine: 'product/line/list' // 产品线权限
}

export function login (parameter) {
  return axios({
    url: api.login,
    method: 'post',
    data: parameter
  })
}

export function getUserList (parameter) {
  return axios({
    url: api.getUserList,
    method: 'post',
    data: parameter
  })
}

export function getLoginMenu (parameter) {
  return axios({
    url: api.getLoginMenu,
    method: 'post',
    data: parameter
  })
}

export function getAccount (parameter) {
  return axios({
    url: api.getAccount,
    method: 'post',
    data: parameter
  })
}

export function checkAccount (parameter) {
  return axios({
    url: api.checkAccount,
    method: 'post',
    data: parameter
  })
}

export function userGetRole (parameter) {
  return axios({
    url: api.userGetRole,
    method: 'post',
    data: parameter
  })
}

export function useDisable (parameter) {
  return axios({
    url: api.useDisable,
    method: 'post',
    data: parameter
  })
}

export function addUser (parameter) {
  return axios({
    url: api.addUser,
    method: 'post',
    data: parameter
  })
}

export function getUserCode (parameter) {
  return axios({
    url: api.getUserCode,
    method: 'post',
    data: parameter
  })
}

export function editUser (parameter) {
  return axios({
    url: api.editUser,
    method: 'post',
    data: parameter
  })
}

export function deletUser (parameter) {
  return axios({
    url: api.deletUser,
    method: 'post',
    data: parameter
  })
}

export function getAuthCode (parameter) {
  return axios({
    url: api.getAuthCode,
    method: 'post',
    data: parameter
  })
}

export function resetByMobile (parameter) {
  return axios({
    url: api.resetByMobile,
    method: 'post',
    data: parameter
  })
}

export function getUserDetail () {
  return axios({
    url: api.getUserDetail,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function checkMobile (parameter) {
  return axios({
    url: api.checkMobile,
    method: 'post',
    data: parameter
  })
}

export function modifyUserPhone (parameter) {
  return axios({
    url: api.modifyUserPhone,
    method: 'post',
    data: parameter
  })
}

export function modifyUserInfo (parameter) {
  return axios({
    url: api.modifyUserInfo,
    method: 'post',
    data: parameter
  })
}

export function permissionsLine (parameter) {
  return axios({
    url: api.permissionsLine,
    method: 'post',
    data: parameter
  })
}
