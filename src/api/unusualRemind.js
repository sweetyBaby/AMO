import { axios } from '@/utils/request'
const api = {
  inventoryWarnList: 'warn/inventoryWarnList', // 库存预警列表查询
  filingWarnList: 'warn/filingWarnList', // 配送商备案效期预警查询
  failureWarnLis: 'warn/failureWarnList', // 失效预警列表查询
  failureWarnDetailList: 'warn/failureWarnDetailList', // 失效预警列表查询
  ignoreFilingWarn: 'warn/ignoreFilingWarn', // 忽略失效预警列表查询
  retriveAffiche: 'notice/list', // 查询公告列表
  addAffiche: 'notice/add', // 添加公告列表
  updateAffiche: 'notice/update', // 修改公告列表
  listMsg: 'notice/listMsg', // 查询所有消息列表
  checkMsgByIds: 'notice/send/his/checkMsgByIds', // 标记消息为已读
  checkAllMsg: 'notice/send/his/checkAllMsg' // 标记所有消息为已读
}
export default api

export function inventoryWarnList (parameter) {
  return axios({
    url: api.inventoryWarnList,
    method: 'post',
    data: parameter
  })
}

export function filingWarnList (parameter) {
  return axios({
    url: api.filingWarnList,
    method: 'post',
    data: parameter
  })
}
export function failureWarnLis (parameter) {
  return axios({
    url: api.failureWarnLis,
    method: 'post',
    data: parameter
  })
}
export function ignoreFilingWarn (parameter) {
  return axios({
    url: api.ignoreFilingWarn,
    method: 'post',
    data: parameter
  })
}

export function retriveAffiche (parameter) {
  return axios({
    url: api.retriveAffiche,
    method: 'post',
    data: parameter
  })
}

export function addAffiche (parameter) {
  return axios({
    url: api.addAffiche,
    method: 'post',
    data: parameter
  })
}

export function updateAffiche (parameter) {
  return axios({
    url: api.updateAffiche,
    method: 'post',
    data: parameter
  })
}

export function listMsg (parameter) {
  return axios({
    url: api.listMsg,
    method: 'post',
    data: parameter
  })
}

export function checkMsgByIds (parameter) {
  return axios({
    url: api.checkMsgByIds,
    method: 'post',
    data: parameter
  })
}

export function checkAllMsg (parameter) {
  return axios({
    url: api.checkAllMsg,
    method: 'post',
    data: parameter
  })
}

export function failureWarnDetailList (parameter) {
  return axios({
    url: api.failureWarnDetailList,
    method: 'post',
    data: parameter
  })
}
