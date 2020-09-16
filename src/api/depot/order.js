import { axios } from '@/utils/request'

const api = {
  getOrderList: 'order/orders', // 获取订单列表
  getOrgdList: 'order/crgdProducts', // 获取华润产品列表
  saveOrder: 'order/postOrder', // 新增订单
  getOrderInfo: 'order/distOrderCompare', // 查看订单明细
  getCrgdPro: 'order/crgdProducts', // 获取华润产品
  OrderCancle: 'order/cancelOrder', // 取消订单
  OrderConfirm: 'order/confirmOrder', // 确认收货
  getSnList: 'order/deliveryOrderDetail', // 获取发货sn
}
export default api

export function getSnList (parameter) {
  return axios({
    url: api.getSnList,
    method: 'post',
    data: parameter
  })
}

export function OrderConfirm (parameter) {
  return axios({
    url: api.OrderConfirm,
    method: 'post',
    data: parameter
  })
}

export function OrderCancle (parameter) {
  return axios({
    url: api.OrderCancle,
    method: 'post',
    data: parameter
  })
}

export function getCrgdPro (parameter) {
  return axios({
    url: api.getCrgdPro,
    method: 'post',
    data: parameter
  })
}

export function getOrderInfo (parameter) {
  return axios({
    url: api.getOrderInfo,
    method: 'post',
    data: parameter
  })
}

export function saveOrder (parameter) {
  return axios({
    url: api.saveOrder,
    method: 'post',
    data: parameter
  })
}

export function getOrderList (parameter) {
  return axios({
    url: api.getOrderList,
    method: 'post',
    data: parameter
  })
}

export function getOrgdList (parameter) {
  return axios({
    url: api.getOrgdList,
    method: 'post',
    data: parameter
  })
}
