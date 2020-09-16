import { axios } from '@/utils/request'

const api = {
  storageOut: 't/in/warehouse/list', // 出库管理
  storagePro: 't/org/product/list',
  cooperList: 'sys/org/info/getOrgListByCodeOrName', // 合作商管理
  getMenuList: 'sys/menu/getMenuTree', // 树菜单
  getMenuTreeNo: 'sys/menu/getMenuTreeWithoutButton',
  getMenuRole: 'sys/role/menu/getRelativeMenuByRole', // 点击获取角色
  getMenuDatas: 'sys/menu/getListByParentNo', // 菜单列表
  addMenuList: 'sys/role/save', // 角色新增编辑
  deleteMenuList: 'sys/role/delete', // 角色删除
  getRoleNewList: 'sys/role/list', // 角色列表
  saveNewMenu: 'sys/menu/save', // 菜单新增编辑
  deleteMenu: 'sys/menu/delete', // 菜单删除
  getSupplier: 'sys/org/info/getCustomeOrSuppliers', // 获取供应商客户列表
  getSupperCode: 'sys/org/info/getSupCodeList', // 获取供应商代码
  getCusCode: 'sys/org/info/getCusCodeList', // 获取客户代码
  getSupInfor: 'sys/org/info/getOrgInfoByOrgId', // 获取供应商/客户详情
  addSupplier: 'sys/org/info/insertOrUpdateInfo', // 新增供应商/客户
  deleteSupplier: 'sys/org/info/delCustomeOrSupplier', // 删除供应商/客户
  enableSupplier: 'sys/org/info/disableOrEnableOrg', // 禁用/启用 供应商
  uploadList: 'sys/org/info/multiUpload', // 上传营业执照
  getProList: 'product/getProductList', // 获取产品列表
  uploadDatas: 'sys/org/info/licenseUpload',
  updateOrInsertOrgInfo: 'sys/org/info/updateOrInsertOrgInfo', // 新增合作商
  delOrg: 'sys/org/info/delOrg', // 删除合作商
  enableOrg: 'sys/org/info/disableOrEnableOrg', // 启用/禁用合作商
  getOrgName: 'sys/org/info/getOrgName', // 用户可以查看的经销商
  getOrgDetail: '/sys/org/info/list', // 厂商列表
  addNewOrg: 'sys/org/info/add', // 新增厂商
  updateOrg: 'sys/org/info/update' // 修改厂商

}

export default api

export function storageOut (parameter) {
  return axios({
    url: api.storageOut,
    method: 'post',
    data: parameter
  })
}

export function storagePro (parameter) {
  return axios({
    url: api.storagePro,
    method: 'post',
    data: parameter
  })
}

export function cooperList (parameter) {
  return axios({
    url: api.cooperList,
    method: 'post',
    data: parameter
  })
}

export function getMenuList (parameter) {
  return axios({
    url: api.getMenuList,
    method: 'post',
    data: parameter
  })
}

export function getMenuRole (parameter) {
  return axios({
    url: api.getMenuRole,
    method: 'post',
    data: parameter
  })
}

// 菜单列表
export function getMenuDatas (parameter) {
  return axios({
    url: api.getMenuDatas,
    method: 'post',
    data: parameter
  })
}

// 新增菜单
export function saveNewMenu (parameter) {
  return axios({
    url: api.saveNewMenu,
    method: 'post',
    data: parameter
  })
}

// 删除菜单
export function deleteMenu (parameter) {
  return axios({
    url: api.deleteMenu,
    method: 'post',
    data: parameter
  })
}

// 新增角色
export function addMenuList (parameter) {
  return axios({
    url: api.addMenuList,
    method: 'post',
    data: parameter
  })
}

export function getRoleNewList (parameter) {
  return axios({
    url: api.getRoleNewList,
    method: 'post',
    data: parameter
  })
}

// 删除角色
export function deleteMenuList (parameter) {
  return axios({
    url: api.deleteMenuList,
    method: 'post',
    data: parameter
  })
}

// 查询供应商/客户  relationType(2-客户；1-供应商)
export function getSupplier (parameter) {
  return axios({
    url: api.getSupplier,
    method: 'post',
    data: parameter
  })
}

// 获取供应商代码
export function getSupperCode (parameter) {
  return axios({
    url: api.getSupperCode,
    method: 'get',
    data: parameter
  })
}

// 获取客户代码
export function getCusCode (parameter) {
  return axios({
    url: api.getCusCode,
    method: 'get',
    data: parameter
  })
}

// 获取供应商/客户详情
export function getSupInfor (parameter) {
  return axios({
    url: api.getSupInfor,
    method: 'post',
    data: parameter
  })
}

// 新增供应商/客户详情
export function addSupplier (parameter) {
  return axios({
    url: api.addSupplier,
    method: 'post',
    data: parameter
  })
}

// 删除供应商/客户详情
export function deleteSupplier (parameter) {
  return axios({
    url: api.deleteSupplier,
    method: 'post',
    data: parameter
  })
}

// 禁用/启用供应商
export function enableSupplier (parameter) {
  return axios({
    url: api.enableSupplier,
    method: 'post',
    data: parameter
  })
}

// 上传营业执照
export function uploadList (parameter) {
  return axios({
    url: api.uploadList,
    method: 'post',
    data: parameter
  })
}

// 上传营业执照
export function uploadDatas (parameter) {
  return axios({
    url: api.uploadDatas,
    method: 'post',
    data: parameter
  })
}

// 获取产品列表
export function getProList (parameter) {
  return axios({
    url: api.getProList,
    method: 'post',
    data: parameter
  })
}

// 新增合作商
export function updateOrInsertOrgInfo (parameter) {
  return axios({
    url: api.updateOrInsertOrgInfo,
    method: 'post',
    data: parameter
  })
}

// 删除合作商
export function delOrg (parameter) {
  return axios({
    url: api.delOrg,
    method: 'post',
    data: parameter
  })
}

// 启用/禁用合作商
export function enableOrg (parameter) {
  return axios({
    url: api.enableOrg,
    method: 'post',
    data: parameter
  })
}

// 用户可以查看的经销商
export function getOrgName (parameter) {
  return axios({
    url: api.getOrgName,
    method: 'post',
    data: parameter
  })
}

// 新增厂商
export function addNewOrg (parameter) {
  return axios({
    url: api.addNewOrg,
    method: 'post',
    data: parameter
  })
}

// 修改厂商
export function updateOrg (parameter) {
  return axios({
    url: api.updateOrg,
    method: 'post',
    data: parameter
  })
}

// 厂商列表
export function getOrgDetail (parameter) {
  return axios({
    url: api.getOrgDetail,
    method: 'post',
    data: parameter
  })
}
