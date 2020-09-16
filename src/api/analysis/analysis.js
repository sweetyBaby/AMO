import { axios } from '@/utils/request'

const api = {
  summaryList: 'report/whReposrt', // 库位汇总统计
  salesList: 'report/salesReport', // 销量汇总统计

}
export default api

export function summaryList (parameter) {
  return axios({
    url: api.summaryList,
    method: 'post',
    data: parameter
  })
}
export function salesList (parameter) {
  return axios({
    url: api.salesList,
    method: 'post',
    data: parameter
  })
}
