import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  auditList: '/auditData',
  orderList: '/orderData',
  permissionUserData: '/permission/getUserData',
  getRoleData: '/role/getRole',
  getMenuDesign: '/menu/getMenuDesign',
  getDistList: '/dist/getDistList',
  getRoleLine: '/role/getRoleLine',
  getCooperData: '/cooperData',
  getLeftTree: '/user/getLeftTree'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getAuditList (parameter) {
  return axios({
    url: api.auditList,
    method: 'get',
    params: parameter
  })
}

export function getOrderList (parameter) {
  return axios({
    url: api.orderList,
    method: 'get',
    // params: parameter
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function permissionUserData (parameter) {
  return axios({
    url: api.permissionUserData,
    method: 'get',
    params: parameter
  })
}

export function getRoleData (parameter) {
  return axios({
    url: api.getRoleData,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

export function getMenuDesign (parameter) {
  return axios({
    url: api.getMenuDesign,
    method: 'get',
    params: parameter
  })
}

export function getDistList (parameter) {
  return axios({
    url: api.getDistList,
    method: 'get',
    params: parameter
  })
}

export function getRoleLine (parameter) {
  return axios({
    url: api.getRoleLine,
    method: 'get',
    params: parameter
  })
}

export function getCooperData (parameter) {
  return axios({
    url: api.getCooperData,
    method: 'get',
    params: parameter
  })
}

export function getLeftTree (parameter) {
  return axios({
    url: api.getLeftTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
