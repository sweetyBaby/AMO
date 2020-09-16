import { axios } from '@/utils/request'

const api = {
  invoiceScan: 'auditManage/invoiceScan', // 发票管理扫码
  invoiceList: 'invoice/list', // 发票管理列表
  invoiceUpdate: 'invoice/update', // 发票管理列表删除 作废 修改
  invoiceDel: 'invoice/delete', // 发票管理删除
  invoiceAdd: 'invoice/add', // 发票管理新增
  invoiceDetail: 'invoice/detail', // 发票管理详情
  invoiceDetailSearch: 'invoice/product/getProduct', // 发票管理详情查询
  invoiceDetailAdd: 'invoice/product/add', // 发票管理详情新增
  invoiceDetailDelete: 'invoice/product/delete', // 发票管理详情删除
  invoiceDetailUpdate: 'invoice/product/update', // 发票管理详情修改
  invoiceSeller: 'invoice/getInvoiceSeller', // 发票管理销货方查询
  invoiceBuyer: 'invoice/getInvoiceBuyer', // 发票管理购货方查询
  deleteImg: 'upload/file/delete', // 发票图片删除
  getNoPicDoc: 'document/getNoPicDoc', // 查询出库单号
  getEstateAudit: 'distribution/invoice/list', // 获取三产A-B发票列表
  EstateUpdate: 'distribution/invoice/update', // 三产A-B发票列表删除 作废 修改
  EstateDel: 'distribution/invoice/delete', // 三产A-B发票列表 作废
  EstateAdd: 'distribution/invoice/add', // 三产A-B发票新增
  EstateDetail: 'distribution/invoice/detail', // 三产A-B发票详情
  EstateProAdd: 'distribution/invoice/product/add', // 三产A-B关联产品
  EstateProDelete: 'distribution/invoice/product/delete', // 三产A-B关联产品删除
  EstateProUpdate: 'distribution/invoice/product/update', // 三产A-B关联产品修改
  getPerssionAudit: 'distribution/invoice/apply/list', // 获取三产B-C发票列表
  PerssionDel: 'distribution/invoice/apply/delete', // 三产B-C发票列表作废
  PerssionUpdate: 'distribution/invoice/apply/update', // 三产B-C发票列表修改
  PerssionAdd: 'distribution/invoice/apply/add', // 三产B-C发票新增
  PerssionDetail: 'distribution/invoice/apply/detail', // 三产B-C发票详情
  getContract: 'distribution/contract/list', // 获取合同管理列表
  contractAdd: 'distribution/contract/add', // 新增合同
  contractdetail: 'distribution/contract/detail', // 合同详情
  contractDel: 'distribution/contract/delete', // 合同删除
  contractUpdate: 'distribution/contract/update', // 合同编辑
  estateProAdd: 'distribution/apply/product/add', // B-C关联产品新增
  estateProUpdate: 'distribution/apply/product/update', // B-C关联产品修改
  estateProDel: 'distribution/apply/product/delete', // B-C关联产品删除
  getEstateDocNo: 'document/initDocumentNo', // 获取B-C出入库单凭证号
  getAuditList: 'invoice/audit/record/list', // 发票审计列表
  auditNewAdd: 'invoice/audit/record/initAudit', // 新增发票审计
  getAuditDetail: 'invoice/audit/detail/list', // 审计项目详情列表
  getAuditInfo: 'invoice/audit/detail/detail', // 审计具体详情
  getAuditUpdate: 'invoice/audit/record/update', // 审计完成
  getSaleMonth: 'closingInvoice/confing/effective', // 获取销量月份
}
export default api

export function getAuditUpdate (parameter) {
  return axios({
    url: api.getAuditUpdate,
    method: 'post',
    data: parameter
  })
}

export function getAuditInfo (parameter) {
  return axios({
    url: api.getAuditInfo,
    method: 'post',
    data: parameter
  })
}

export function getAuditDetail (parameter) {
  return axios({
    url: api.getAuditDetail,
    method: 'post',
    data: parameter
  })
}

export function auditNewAdd (parameter) {
  return axios({
    url: api.auditNewAdd,
    method: 'post',
    data: parameter
  })
}

export function getEstateDocNo (parameter) {
  return axios({
    url: api.getEstateDocNo,
    method: 'post',
    data: parameter
  })
}

export function estateProDel (parameter) {
  return axios({
    url: api.estateProDel,
    method: 'post',
    data: parameter
  })
}

export function estateProUpdate (parameter) {
  return axios({
    url: api.estateProUpdate,
    method: 'post',
    data: parameter
  })
}

export function estateProAdd (parameter) {
  return axios({
    url: api.estateProAdd,
    method: 'post',
    data: parameter
  })
}

export function contractUpdate (parameter) {
  return axios({
    url: api.contractUpdate,
    method: 'post',
    data: parameter
  })
}

export function contractDel (parameter) {
  return axios({
    url: api.contractDel,
    method: 'post',
    data: parameter
  })
}

export function contractdetail (parameter) {
  return axios({
    url: api.contractdetail,
    method: 'post',
    data: parameter
  })
}

export function contractAdd (parameter) {
  return axios({
    url: api.contractAdd,
    method: 'post',
    data: parameter
  })
}

export function getContract (parameter) {
  return axios({
    url: api.getContract,
    method: 'post',
    data: parameter
  })
}

export function PerssionDetail (parameter) {
  return axios({
    url: api.PerssionDetail,
    method: 'post',
    data: parameter
  })
}

export function PerssionAdd (parameter) {
  return axios({
    url: api.PerssionAdd,
    method: 'post',
    data: parameter
  })
}

export function PerssionDel (parameter) {
  return axios({
    url: api.PerssionDel,
    method: 'post',
    data: parameter
  })
}

export function PerssionUpdate (parameter) {
  return axios({
    url: api.PerssionUpdate,
    method: 'post',
    data: parameter
  })
}

// 作废
export function EstateDel (parameter) {
  return axios({
    url: api.EstateDel,
    method: 'post',
    data: parameter
  })
}

export function getPerssionAudit (parameter) {
  return axios({
    url: api.getPerssionAudit,
    method: 'post',
    data: parameter
  })
}

export function EstateProUpdate (parameter) {
  return axios({
    url: api.EstateProUpdate,
    method: 'post',
    data: parameter
  })
}

export function EstateProDelete (parameter) {
  return axios({
    url: api.EstateProDelete,
    method: 'post',
    data: parameter
  })
}

export function EstateProAdd (parameter) {
  return axios({
    url: api.EstateProAdd,
    method: 'post',
    data: parameter
  })
}

export function EstateDetail (parameter) {
  return axios({
    url: api.EstateDetail,
    method: 'post',
    data: parameter
  })
}

export function EstateAdd (parameter) {
  return axios({
    url: api.EstateAdd,
    method: 'post',
    data: parameter
  })
}

export function EstateUpdate (parameter) {
  return axios({
    url: api.EstateUpdate,
    method: 'post',
    data: parameter
  })
}

export function getEstateAudit (parameter) {
  return axios({
    url: api.getEstateAudit,
    method: 'post',
    data: parameter
  })
}

export function getAuditList (parameter) {
  return axios({
    url: api.getAuditList,
    method: 'post',
    data: parameter
  })
}

export function getNoPicDoc (parameter) {
  return axios({
    url: api.getNoPicDoc,
    method: 'post',
    data: parameter
  })
}

export function invoiceScan (parameter) {
  return axios({
    url: api.invoiceScan,
    method: 'get',
    data: parameter
  })
}
export function invoiceList (parameter) {
  return axios({
    url: api.invoiceList,
    method: 'post',
    data: parameter
  })
}

export function invoiceUpdate (parameter) {
  return axios({
    url: api.invoiceUpdate,
    method: 'post',
    data: parameter
  })
}

export function invoiceDel (parameter) {
  return axios({
    url: api.invoiceDel,
    method: 'post',
    data: parameter
  })
}

export function invoiceAdd (parameter) {
  return axios({
    url: api.invoiceAdd,
    method: 'post',
    data: parameter
  })
}

export function invoiceDetail (parameter) {
  return axios({
    url: api.invoiceDetail,
    method: 'post',
    data: parameter
  })
}

export function invoiceDetailSearch (parameter) {
  return axios({
    url: api.invoiceDetailSearch,
    method: 'post',
    data: parameter
  })
}

export function invoiceDetailAdd (parameter) {
  return axios({
    url: api.invoiceDetailAdd,
    method: 'post',
    data: parameter
  })
}
export function invoiceDetailDelete (parameter) {
  return axios({
    url: api.invoiceDetailDelete,
    method: 'post',
    data: parameter
  })
}
export function invoiceDetailUpdate (parameter) {
  return axios({
    url: api.invoiceDetailUpdate,
    method: 'post',
    data: parameter
  })
}
export function invoiceSeller () {
  return axios({
    url: api.invoiceSeller,
    method: 'post'
  })
}
export function invoiceBuyer (parameter) {
  return axios({
    url: api.invoiceBuyer,
    method: 'post',
    data: parameter
  })
}
export function deleteImg (parameter) {
  return axios({
    url: api.deleteImg,
    method: 'post',
    data: parameter
  })
}

export function getSaleMonth (parameter) {
  return axios({
    url: api.getSaleMonth,
    method: 'post',
    data: parameter
  })
}
