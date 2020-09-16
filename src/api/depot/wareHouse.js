import {
  axios
} from '@/utils/request'

const api = {
  getWareList: 'document/list', // 获取产品入库列表
  addWareData: 'document/initDocument', // 产品入库初始化
  whList: 'dist/wh/findAll', // 库位列表
  hosUserList: 'hos/cus/getList', // 获取医院客户列表
  getCuslist: 'dist/cus/getCuslist', // 获取经销商客户列表
  preStorage: 'advance/inout/detail/list', // 预入库列表
  preSt: 'advance/inout/detail/productListForReject', // 预入库列表
  getProductBatch: 'product/getProductBatch', // 产品批号列表
  getDegree: 'product/degree/getDegreeList', // 获取度数
  initProductNone: 'product/initProductNone', // 无码初始化
  scanIn: 'product/scanIn', // 扫码入库
  listByDocNo: 'advance/inout/detail/listByDocNo', // 整单入库
  proDetail: 'document/detail', // 出入库详情
  submitProduct: 'document/submitProduct', // 产品入库新增
  importProduct: 'document/importExcelProduct', // 出入库上传
  rejection: 'dist/product/apply/list', // 申请/拒收列表
  applySave: 'dist/product/apply/saveList', // 申请/拒收新增
  draftsList: 'drafts/list', // 草稿箱
  draftsNew: 'drafts/add', // 新增草稿箱
  draftsDelete: 'drafts/delete', // 删除草稿箱
  draftsDetail: 'drafts/detail', // 草稿详情
  getDocumentCusList: 'document/getDocumentCusList', // 获取用户列表
  getDocumentWhList: 'document/getDocumentWhList', // 获取库位名称
  retrvieModel: 'product/registration/findListByModel', // 获取产品注册证号
  getRegistration: 'product/registration/findListByModel', // 获取注册证列表
  getFromProIn: 'inventory/detail/list', // 在库产品新增
  getFrom: 'inventory/detail/listForReturn', // 在库产品新增
  scanOut: 'product/scanOut', // 扫码出库
  proAllotList: 'whAllocate/list', // 产品调拨列表
  proAllotDetail: 'whAllocate/detail', // 产品调拨详情
  userDistRange: 'user/userDistRange', // 获取经销商列表
  getAutoJson: 'report/his/getAutoJson', // 文件管理跳转
  getSuccessAutoJson: 'report/his/getSuccessAutoJson', // 文件管理成功跳转
  getDocumentDistList: 'document/getDocumentDistList', // 获取经销商列表
  getDocumentErrorList: 'document/getDocumentErrorList', // 获取异常数据列表
  getInOutDetailByDocNo: 'inout/detail/getInOutDetailByDocNo', // 异常数据详情
  findJsList: 'dist/wh/findJsList', // 选择赊销库位

  // 首页接口
  fetchIndexInfos: 'index/fetchIndexInfos', // 首页基础信息
  fetchIndexByCondition: 'index/fetchIndexByCondition', // 切换获取信息
  verifyApply: 'dist/product/apply/batchVerifyApply', // 审批
  setZero: 'zeroSalesStatistics/setZero', // 0销量上报
  zeroList: 'zeroSalesStatistics/list', // 0销量列表

  unAuthHosList: 'dist/hos/unAuthHosList', // 未授权客户名称
  salesReport: 'report/sales/export', // 销量报表
  monthList: 'report/monthlyReport/history', // 月报列表

  getCusCodeByDistCode: 'hos/cus/getCusCodeByDistCode', // 查询已授权的配送商
  getDistributionCusListForOptions: 'distribution/cus/getDistributionCusListForOptions', // 查询未授权的配送商
}
export default api

export function getWareList(parameter) {
  return axios({
    url: api.getWareList,
    method: 'post',
    data: parameter
  })
}

export function addWareData(parameter) {
  return axios({
    url: api.addWareData,
    method: 'post',
    data: parameter
  })
}

export function preStorage(parameter) {
  return axios({
    url: api.preStorage,
    method: 'post',
    data: parameter
  })
}
export function preSt(parameter) {
  return axios({
    url: api.preSt,
    method: 'post',
    data: parameter
  })
}

export function getProductBatch(parameter) {
  return axios({
    url: api.getProductBatch,
    method: 'post',
    data: parameter
  })
}

export function getDegree(parameter) {
  return axios({
    url: api.getDegree,
    method: 'post',
    data: parameter
  })
}

export function initProductNone(parameter) {
  return axios({
    url: api.initProductNone,
    method: 'post',
    data: parameter
  })
}

export function scanIn(parameter) {
  return axios({
    url: api.scanIn,
    method: 'post',
    data: parameter
  })
}

export function listByDocNo(parameter) {
  return axios({
    url: api.listByDocNo,
    method: 'post',
    data: parameter
  })
}

export function proDetail(parameter) {
  return axios({
    url: api.proDetail,
    method: 'post',
    data: parameter
  })
}

export function submitProduct(parameter) {
  return axios({
    url: api.submitProduct,
    method: 'post',
    data: parameter
  })
}

export function rejection(parameter) {
  return axios({
    url: api.rejection,
    method: 'post',
    data: parameter
  })
}

export function applySave(parameter) {
  return axios({
    url: api.applySave,
    method: 'post',
    data: parameter
  })
}

export function draftsList(parameter) {
  return axios({
    url: api.draftsList,
    method: 'post',
    data: parameter
  })
}

export function draftsNew(parameter) {
  return axios({
    url: api.draftsNew,
    method: 'post',
    data: parameter
  })
}

export function draftsDelete(parameter) {
  return axios({
    url: api.draftsDelete,
    method: 'post',
    data: parameter
  })
}

export function draftsDetail(parameter) {
  return axios({
    url: api.draftsDetail,
    method: 'post',
    data: parameter
  })
}

export function importProduct(parameter) {
  return axios({
    url: api.importProduct,
    method: 'post',
    data: parameter
  })
}

export function whList(parameter) {
  return axios({
    url: api.whList,
    method: 'post',
    data: parameter
  })
}

export function hosUserList(parameter) {
  return axios({
    url: api.hosUserList,
    method: 'post',
    data: parameter
  })
}

export function getCuslist(parameter) {
  return axios({
    url: api.getCuslist,
    method: 'post',
    data: parameter
  })
}

export function getDocumentCusList(parameter) {
  return axios({
    url: api.getDocumentCusList,
    method: 'post',
    data: parameter
  })
}

export function retrvieModel(parameter) {
  return axios({
    url: api.retrvieModel,
    method: 'post',
    data: parameter
  })
}

export function getRegistration(parameter) {
  return axios({
    url: api.getRegistration,
    method: 'post',
    data: parameter
  })
}

export function getFromProIn(parameter) {
  return axios({
    url: api.getFromProIn,
    method: 'post',
    data: parameter
  })
}

export function scanOut(parameter) {
  return axios({
    url: api.scanOut,
    method: 'post',
    data: parameter
  })
}

export function getDocumentWhList(parameter) {
  return axios({
    url: api.getDocumentWhList,
    method: 'post',
    data: parameter
  })
}

export function proAllotList(parameter) {
  return axios({
    url: api.proAllotList,
    method: 'post',
    data: parameter
  })
}

export function proAllotDetail(parameter) {
  return axios({
    url: api.proAllotDetail,
    method: 'post',
    data: parameter
  })
}

export function userDistRange(parameter) {
  return axios({
    url: api.userDistRange,
    method: 'post',
    data: parameter
  })
}

export function fetchIndexInfos(parameter) {
  return axios({
    url: api.fetchIndexInfos,
    method: 'post',
    data: parameter
  })
}

export function fetchIndexByCondition(parameter) {
  return axios({
    url: api.fetchIndexByCondition,
    method: 'post',
    data: parameter
  })
}

export function getAutoJson(parameter) {
  return axios({
    url: api.getAutoJson,
    method: 'post',
    data: parameter
  })
}

export function getSuccessAutoJson(parameter) {
  return axios({
    url: api.getSuccessAutoJson,
    method: 'post',
    data: parameter
  })
}

export function getDocumentDistList(parameter) {
  return axios({
    url: api.getDocumentDistList,
    method: 'post',
    data: parameter
  })
}

export function verifyApply(parameter) {
  return axios({
    url: api.verifyApply,
    method: 'post',
    data: parameter
  })
}

export function getDocumentErrorList(parameter) {
  return axios({
    url: api.getDocumentErrorList,
    method: 'post',
    data: parameter
  })
}

export function getInOutDetailByDocNo(parameter) {
  return axios({
    url: api.getInOutDetailByDocNo,
    method: 'post',
    data: parameter
  })
}

export function findJsList(parameter) {
  return axios({
    url: api.findJsList,
    method: 'post',
    data: parameter
  })
}

export function getFrom(parameter) {
  return axios({
    url: api.getFrom,
    method: 'post',
    data: parameter
  })
}

export function unAuthHosList(parameter) {
  return axios({
    url: api.unAuthHosList,
    method: 'post',
    data: parameter
  })
}

export function setZero(parameter) {
  return axios({
    url: api.setZero,
    method: 'post',
    data: parameter
  })
}

export function zeroList(parameter) {
  return axios({
    url: api.zeroList,
    method: 'post',
    data: parameter
  })
}

export function salesReport(parameter) {
  return axios({
    url: api.salesReport,
    method: 'post',
    data: parameter
  })
}

export function monthList(parameter) {
  return axios({
    url: api.monthList,
    method: 'post',
    data: parameter
  })
}
export function getCusCodeByDistCode(parameter) {
  return axios({
    url: api.getCusCodeByDistCode,
    method: 'post',
    data: parameter
  })
}
export function getDistributionCusListForOptions(parameter) {
  return axios({
    url: api.getDistributionCusListForOptions,
    method: 'post',
    data: parameter
  })
}
