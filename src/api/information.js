import { axios } from '@/utils/request'
const api = {
  retriveMyDetail: 'dist/myDetail', // 基础信息设置的查询
  updateMyDetail: 'dist/update', // 更新基础信息
  retrivePersonal: 'user/info', // 查询个人中心的信息
  verificationCode: 'user/getVerificationCode', // 获取手机验证码
  bindingPhone: 'user/bindMobile', // 改绑手机
  updatePassword: 'user/updatePassword', // 修改密码
  updatePerson: 'user/update', // 修改个人中心,
  retriveLocation: 'warehouse/list', // 查询库位列表
  deleLocation: 'warehouse/delete', // 查询库位列表
  addLocation: 'warehouse/save', // 增加库位列表
  updateLocation: 'warehouse/update', // 修改库位列表
  retriveCusProducts: 'dist/product/myCusProducts', // 查询我的产品
  deleteCusProducts: 'dist/product/delete', // 删除我的产品
  addCusProducts: 'dist/product/saveOrUpdateDistProdcut', // 添加我的产品
  retriveWareData: 'warehouse/warning/config/list', // 预警查询产品dist/cus/getDistCusList
  retriveCus: 'dist/cus/getDistCusList', // 查询客户
  deletCus: 'dist/cus/deleteDistCus', // 删除客户
  addOrUpdateCus: 'dist/cus/updateDistCus', // 添加或修改客户
  updatePasswordByMobile: 'user/updatePasswordByMobile', // 根据手机修改密码
  setPrimary: 'warehouse/setPrimary', // 是否设为主库
  retriveFile: 'report/his/queryInoutHis', // 出入库文件管理
  retriveMycus: 'dist/cus/findCusList', // 查询客户代码
  generateCode: 'warehouse/generateCode', // 将库位名称转为英文
}
export default api

export function retriveMyDetail (parameter) {
  return axios({
    url: api.retriveMyDetail,
    method: 'post',
    data: parameter
  })
}

export function updateMyDetail (parameter) {
  return axios({
    url: api.updateMyDetail,
    method: 'post',
    data: parameter
  })
}
export function retrivePersonal (parameter) {
  return axios({
    url: api.retrivePersonal,
    method: 'post',
    data: parameter
  })
}
export function verificationCode (parameter) {
  return axios({
    url: api.verificationCode,
    method: 'post',
    data: parameter
  })
}

export function bindingPhone (parameter) {
  return axios({
    url: api.bindingPhone,
    method: 'post',
    data: parameter
  })
}

export function updatePassword (parameter) {
  return axios({
    url: api.updatePassword,
    method: 'post',
    data: parameter
  })
}

export function updatePerson (parameter) {
  return axios({
    url: api.updatePerson,
    method: 'post',
    data: parameter
  })
}
export function retriveLocation (parameter) {
  return axios({
    url: api.retriveLocation,
    method: 'post',
    data: parameter
  })
}

export function deleLocation (parameter) {
  return axios({
    url: api.deleLocation,
    method: 'post',
    data: parameter
  })
}
export function addLocation (parameter) {
  return axios({
    url: api.addLocation,
    method: 'post',
    data: parameter
  })
}

export function retriveCusProducts (parameter) {
  return axios({
    url: api.retriveCusProducts,
    method: 'post',
    data: parameter
  })
}

export function deleteCusProducts (parameter) {
  return axios({
    url: api.deleteCusProducts,
    method: 'post',
    data: parameter
  })
}

export function addCusProducts (parameter) {
  return axios({
    url: api.addCusProducts,
    method: 'post',
    data: parameter
  })
}

export function retriveWareData (parameter) {
  return axios({
    url: api.retriveWareData,
    method: 'post',
    data: parameter
  })
}

export function updateLocation (parameter) {
  return axios({
    url: api.updateLocation,
    method: 'post',
    data: parameter
  })
}

export function retriveCus (parameter) {
  return axios({
    url: api.retriveCus,
    method: 'post',
    data: parameter
  })
}

export function deletCus (parameter) {
  return axios({
    url: api.deletCus,
    method: 'post',
    data: parameter
  })
}

export function addOrUpdateCus (parameter) {
  return axios({
    url: api.addOrUpdateCus,
    method: 'post',
    data: parameter
  })
}

export function updatePasswordByMobile (parameter) {
  return axios({
    url: api.updatePasswordByMobile,
    method: 'post',
    data: parameter
  })
}

export function setPrimary (parameter) {
  return axios({
    url: api.setPrimary,
    method: 'post',
    data: parameter
  })
}

export function retriveFile (parameter) {
  return axios({
    url: api.retriveFile,
    method: 'post',
    data: parameter
  })
}

export function retriveMycus (parameter) {
  return axios({
    url: api.retriveMycus,
    method: 'post',
    data: parameter
  })
}

export function generateCode (parameter) {
  return axios({
    url: api.generateCode,
    method: 'post',
    data: parameter
  })
}
