import { axios } from '@/utils/request'

const api = {
  allocationList: 'depot/allocation', // 产品调拨列表
  SnapshotListDetails: 'dist/stock/daily/detail/querySnapshotDailyDetailByCondition', // 库存快照详情
  querySnapshotDailyDetailByCondition: 'dist/stock/daily/detail/querySnapshotDailyDetailByCondition', // 库存快照小型号查询详情
  querySnapshotWithProType: 'dist/stock/daily/detail/querySnapshotWithProType', // 库存快照按大型号查询详情
  SnapshotList: 'dist/stock/daily/querySnapshotSummaryByCondition', // 库存快照
  ReportingList: 'report/his/queryByCondition', // 库存上报
  CheckList: 'stock/compare/queryByCondition', // 库存核查
  CheckDetailsList: 'stock/compare/detail/queryByCondition', // 库存核查详情
  ErrorMsg: 'report/his/error/queryByCondition', // 错误信息
  retriveNameData: 'dist/getDistNameAndCode', // 查询经销商代码
  CodeSearch: 'product/sn/getProductDetail', // 唯一码查询
  fetchTemplate: 'template/fetchTemplateURI', // 下载模板
  inventoryList: 'inventory/productList', // 库存表
  inoutReport: 'report/inoutReport', // 出入库统计
  retriveList: 'inventoryMemory/list', // 无码查询
  saveList: 'inventoryMemory/save', // 无码新增
  productCount: 'inventory/productCount', // 无码新增
  exportDetail: 'inventory/exportDetail', // 导出
  fetchWhInfo: 'dist/wh/fetchWhInfo' // 产品状态
}
export default api

export function allocationList (parameter) {
  return axios({
    url: api.allocationList,
    method: 'get'
    // data: parameter
  })
}

export function SnapshotListDetails (parameter) {
  return axios({
    url: api.SnapshotListDetails,
    method: 'post',
    data: parameter
  })
}
export function SnapshotList (parameter) {
  return axios({
    url: api.SnapshotList,
    method: 'post',
    data: parameter
  })
}

export function ReportingList (parameter) {
  return axios({
    url: api.ReportingList,
    method: 'post',
    data: parameter
  })
}

export function CheckList (parameter) {
  return axios({
    url: api.CheckList,
    method: 'post',
    data: parameter
  })
}

export function CheckDetailsList (parameter) {
  return axios({
    url: api.CheckDetailsList,
    method: 'post',
    data: parameter
  })
}

export function ErrorMsg (parameter) {
  return axios({
    url: api.ErrorMsg,
    method: 'post',
    data: parameter
  })
}

export function retriveNameData (parameter) {
  return axios({
    url: api.retriveNameData,
    method: 'post',
    data: parameter
  })
}

export function CodeSearch (parameter) {
  return axios({
    url: api.CodeSearch,
    method: 'post',
    data: parameter
  })
}

export function fetchTemplate (parameter) {
  return axios({
    url: api.fetchTemplate + '?' + parameter,
    method: 'post'
  })
}

export function inventoryList (parameter) {
  return axios({
    url: api.inventoryList,
    method: 'post',
    data: parameter
  })
}

export function inoutReport (parameter) {
  return axios({
    url: api.inoutReport,
    method: 'post',
    data: parameter
  })
}

export function retriveList (parameter) {
  return axios({
    url: api.retriveList,
    method: 'post',
    data: parameter
  })
}
export function saveList (parameter) {
  return axios({
    url: api.saveList,
    method: 'post',
    data: parameter
  })
}

export function productCount (parameter) {
  return axios({
    url: api.productCount,
    method: 'post',
    data: parameter
  })
}

export function exportDetail (parameter) {
  return axios({
    url: api.exportDetail,
    method: 'post',
    data: parameter,
    responseType: 'blob'
  })
}

export function querySnapshotWithProType (parameter) {
  return axios({
    url: api.querySnapshotWithProType,
    method: 'post',
    data: parameter
  })
}

export function querySnapshotDailyDetailByCondition (parameter) {
  return axios({
    url: api.querySnapshotDailyDetailByCondition,
    method: 'post',
    data: parameter
  })
}

export function fetchWhInfo (parameter) {
  return axios({
    url: api.fetchWhInfo,
    method: 'post',
    data: parameter
  })
}
