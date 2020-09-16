import { axios } from '@/utils/request'

const api = {
  addPurchase: '/t/buy/plan/add',
  purchasePlan: '/t/buy/plan/list',
  delPurchasePlan: '/t/buy/plan/delete',
  purchaseReview: '/t/buy/plan/audit',
  getPurchaseDetail: '/t/buy/plan/detail/list',
  delPurchaseDetail: '/t/buy/plan/detail/delete',
  editPurchasePlan: '/t/buy/plan/update',
  productList: '/t/org/product/list',
  findPackageDetail: '/t/package/product/findPackageDetail',
  // 采购计划添加商品
  plandetailAdd: '/t/buy/plan/detail/add',
  // 采购单接收添加商品
  orderdetailAdd: '/t/buy/order/detail/add',
  // 采购单付款
  orderPay: 't/buy/order/pay',
  // 分页获取采购单
  getorderList: 't/buy/order/list',
  // 采购单到票
  orderTicket: 't/buy/order/ticket',
  // 采购单接收
  orderReceive: 't/buy/order/receive',
  // 采购单详细
  orderDetail: 't/buy/order/detail/list',
  // 根据产品code获取供应商
  getProduce: 't/org/product/getProductByCode'
}

// 新建采购
export function addPurchase(parameter) {
  return axios({
    url: api.addPurchase,
    method: 'post',
    data: parameter
  })
}
// 采购计划查询
export function purchasePlan(parameter) {
  return axios({
    url: api.purchasePlan,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}
// 删除采购计划
export function delPurchasePlan(id) {
  return axios({
    url: api.delPurchasePlan + '?id=' + id,
    method: 'delete'
  })
}
// 采购计划添加商品

export function planDetailAdd(parameter) {
  return axios({
    url: api.plandetailAdd,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}
// 采购单接收添加商品

export function orderdetailAdd(parameter) {
  return axios({
    url: api.orderdetailAdd,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}
// 根据产品code获取供应商
export function getProduce(id) {
  return axios({
    url: api.getProduce + '?productCode=' + id,
    method: 'post',
  }).then(response => response.data)
}
// 采购审核
export function purchaseReview(parameter) {
  return axios({
    url: api.purchaseReview,
    method: 'post',
    data: parameter
  })
}
// 根据采购计划获取详情
export function getPurchaseDetail(parameter) {
  return axios({
    url: api.getPurchaseDetail,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}
// 删除采购计划详细
export function delPurchaseDetail(id) {
  return axios({
    url: api.delPurchaseDetail + '?id=' + id,
    method: 'delete',
  })
}
// 修改采购计划
export function editPurchasePlan(parameter) {
  return axios({
    url: api.editPurchasePlan,
    method: 'post',
    data: parameter
  })
}
// 获取所有产品

export function getProductList(parameter) {
  return axios({
    url: api.productList,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}

// 获取产品详情
export function findPackageDetail(parameter) {
  return axios({
    url: api.findPackageDetail,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}

// 采购单付款
export function orderPay(parameter) {
  return axios({
    url: api.orderPay,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}

// 采购单分页查询
export function orderList(parameter) {
  return axios({
    url: api.getorderList,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}
// 采购单到票
export function orderTicket(parameter) {
  return axios({
    url: api.orderTicket,
    method: 'post',
    data: parameter
  }).then(response => response.data)
}

// 采购单接收
export function orderReceive(parameter) {
  return axios({
    url: api.orderReceive,
    method: 'post',
    data: parameter
  }).then(response => response)
}

// 采购单详情
export function orderDetail(id) {
  return axios({
    url: api.orderDetail + '?id=' + id,
    method: 'post',
  }).then(response => response.data)
}
