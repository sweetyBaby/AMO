import { axios } from '@/utils/request'

const api = {
  outVoucherList: 'document/voucher/list', // 出库单凭证列表
  outVoucherVadd: 'document/voucher/add', // 出库单凭证新增
  outVoucherUpdate: 'document/voucher/update', // 出库单凭证作废
  outVoucherDetails: 'document/voucher/detail', // 出库单凭证详情
  addOutPro: 'document/voucher/product/add', // 出入库单凭证关联产品 手动新增
  updateOutPro: 'document/voucher/product/update', // 出入库单凭证关联产品 编辑
  deleteOutPro: 'document/voucher/product/delete', // 出入库单凭证关联产品 删除
  getOutProList: 'document/voucher/product/list', // 出入库单凭证关联产品 列表

}
export default api

export function getOutProList (parameter) {
  return axios({
    url: api.getOutProList,
    method: 'post',
    data: parameter
  })
}

export function deleteOutPro (parameter) {
  return axios({
    url: api.deleteOutPro,
    method: 'post',
    data: parameter
  })
}

export function updateOutPro (parameter) {
  return axios({
    url: api.updateOutPro,
    method: 'post',
    data: parameter
  })
}

export function addOutPro (parameter) {
  return axios({
    url: api.addOutPro,
    method: 'post',
    data: parameter
  })
}

export function outVoucherList (parameter) {
  return axios({
    url: api.outVoucherList,
    method: 'post',
    data: parameter
  })
}
export function outVoucherVadd (parameter) {
  return axios({
    url: api.outVoucherVadd,
    method: 'post',
    data: parameter
  })
}
export function outVoucherUpdate (parameter) {
  return axios({
    url: api.outVoucherUpdate,
    method: 'post',
    data: parameter
  })
}
export function outVoucherDetails (parameter) {
  return axios({
    url: api.outVoucherDetails,
    method: 'post',
    data: parameter
  })
}
