import { axios } from '@/utils/request'
const api = {
  reserveSNTable: 'product/sn/getProductSnList', // 查询产品SN主数据
  deleSNData: 'product/sn/deleteProductSn', // 删除产品SN主数据
  insertSNData: 'product/sn/insertOrUpdateProductSn', // 增加或修改产品SN主数据
  findProductMo: 'product/getFieldList', // 查询产品型号
  getProductType: 'product/getProductType', // 查询产品状态
  retriveProductTable: 'product/getProductList', // 产品主数据的查询
  addProductTable: 'product/insertOrUpdateProduct', // 产品主数据的查询
  deleProductTable: 'product/deleteProduct', // 产品主数据的删除
  retiveDegreeTable: 'product/degree/getProductDegreeList', // 产品度数对应表的查询
  enableOrDisable: 'product/enableOrDisable', // 是否禁用度数
  addProductDegree: 'product/degree/insertProDegree', // 增加产品度数
  retriveHosData: 'hospital/getHospitalList', // 医院主数据的查询
  deleHosData: 'hospital/deleteHospital', // 医院主数据的删除
  addHosData: 'hospital/insertOrUpdateHospital', // 添加或修改医院主数据
  retriveDistData: 'distribution/cus/getDistributionCusList', // 配送商查询数据
  addDistData: 'distribution/cus/insertOrUpdateDistributionCus', // 添加或修改配送商数据
  deleDistData: 'distribution/cus/deleteDistributionCus', // 添删除配送商数据
  retriveDealersData: 'dist/getDistList', // 经销商主数据查询
  retriveHost: 'dictionary/getDictionaryList', // 查询医院类型 区域 地区 性质
  deleDealersData: 'dist/deleteDist', // 删除经销商主数据
  retriveHostProcurement: 'hos/cus/getHosCusList', // 医院采购代理数据查询
  deleHostProcurement: 'hos/cus/deleteHosCus', // 医院采购代理数据查询删除
  addHostProcurement: 'hos/cus/insertOrUpdateHusCus', // 医院采购代理数据修改和添加
  retriveNameData: 'dist/getDistNameAndCode', // 查询经销商代码
  retriveHostName: 'hospital/getCodeAndName', // 查询医院代码
  retriveCustName: 'distribution/cus/getCusCodeAndName', // 查询配送商代码
  retriveAccreditHost: 'dist/hos/getDistHosAuthList', // 查询授权医院主数据
  AddDealersHost: 'dist/hos/insertOrUpdateDistHosAuth', // 新增授权医院主数据
  deleDealersHost: 'dist/hos/deleteDistHosAuth', // 删除授权医院主数据
  addDealersData: 'dist/insertOrUpdateDist', // 新增经销商主数据
  modifyRecordDealers: 'dist/modify/his/findHisList', // 查看经销商主数据修改记录
  detailsHistory: 'dist/modify/his/returnDistHis', // 查看经销商主数据修改记录详细信息
  getModelAndName: 'product/getModelAndName', // 查询产品型号及名称
  closeList: 'closingInvoice/confing/list', // 关账列表页
  closeAdd: 'closingInvoice/confing/add', // 新增关账设置
  closeUpdate: 'closingInvoice/confing/update', // 编辑关账设置
  addHosSale: 'distHosQuotaConfig/add', // 新增医院销售指标
  myHostQuoList: 'hosQuotaConfig/list', // 我的医院销售指标列表
  hosQuoList: 'sys/hosQuotaConfig/list', // 医院销售指标列表
  hosQuoAdd: 'hosQuotaConfig/add', // 医院销售指标新增
  hosQuoDetail: 'sys/hosQuotaConfig/detail', // 医院销售指标详情
  myHosQuoDetail: 'hosQuotaConfig/detail', // 医院销售指标详情
  hosQuoUpdate: 'hosQuotaConfig/update', // 医院销售指标编辑
  hosQuoDelete: 'hosQuotaConfig/delete', // 医院销量指标删除
  distHosList: 'distHosQuotaConfig/list', // 指标达标率
  distHosDetail: 'distHosQuotaConfig/detail', // 指标达成率详情
  relationAdd: 'distHosAuth/config/add', // 医院授权关系新增
  relationList: 'distHosAuth/config/list', // 医院授权关系列表
  relationUpdate: 'distHosAuth/config/update', // 医院授权关系编辑
  relationDel: 'distHosAuth/config/delete', // 医院授权关系删除
  relationDetail: 'distHosAuth/config/detail', // 医院授权关系详情
  getHosMapList: 'hospitalMapping/list', // 获取医院可开票名称
  addHosMap: 'hospitalMapping/add', // 新增医院可开票名称
  updateHosMap: 'hospitalMapping/update', // 修改医院可开票名称
  delHosMap: 'hospitalMapping/delete', // 删除医院可开票名称
}

export default api

// 医院授权关系详情
export function relationDetail (parameter) {
  return axios({
    url: api.relationDetail,
    method: 'post',
    data: parameter
  })
}

// 医院授权关系删除
export function relationDel (parameter) {
  return axios({
    url: api.relationDel,
    method: 'post',
    data: parameter
  })
}

// 医院授权关系编辑
export function relationUpdate (parameter) {
  return axios({
    url: api.relationUpdate,
    method: 'post',
    data: parameter
  })
}

// 医院授权关系列表
export function relationList (parameter) {
  return axios({
    url: api.relationList,
    method: 'post',
    data: parameter
  })
}

// 医院授权关系新增
export function relationAdd (parameter) {
  return axios({
    url: api.relationAdd,
    method: 'post',
    data: parameter
  })
}

// 医院销售指标列表
export function myHostQuoList (parameter) {
  return axios({
    url: api.myHostQuoList,
    method: 'post',
    data: parameter
  })
}

// 指标达成率详情
export function distHosDetail (parameter) {
  return axios({
    url: api.distHosDetail,
    method: 'post',
    data: parameter
  })
}

// 指标达标率
export function distHosList (parameter) {
  return axios({
    url: api.distHosList,
    method: 'post',
    data: parameter
  })
}

// 医院销售指标新增
export function hosQuoDelete (parameter) {
  return axios({
    url: api.hosQuoDelete,
    method: 'post',
    data: parameter
  })
}

// 医院销售指标新增
export function hosQuoUpdate (parameter) {
  return axios({
    url: api.hosQuoUpdate,
    method: 'post',
    data: parameter
  })
}

// 医院销售指标新增
export function hosQuoDetail (parameter) {
  return axios({
    url: api.hosQuoDetail,
    method: 'post',
    data: parameter
  })
}

//  我的医院销售指标新增
export function myHosQuoDetail (parameter) {
  return axios({
    url: api.myHosQuoDetail,
    method: 'post',
    data: parameter
  })
}

// 医院销售指标新增
export function hosQuoAdd (parameter) {
  return axios({
    url: api.hosQuoAdd,
    method: 'post',
    data: parameter
  })
}

// 我的医院销售指标列表
export function hosQuoList (parameter) {
  return axios({
    url: api.hosQuoList,
    method: 'post',
    data: parameter
  })
}

// 新增医院销售指标
export function addHosSale (parameter) {
  return axios({
    url: api.addHosSale,
    method: 'post',
    data: parameter
  })
}

// 查询产品SN主数据
export function reserveSNTable (parameter) {
  return axios({
    url: api.reserveSNTable,
    method: 'post',
    data: parameter
  })
}

export function deleSNData (parameter) {
  return axios({
    url: api.deleSNData,
    method: 'post',
    data: parameter
  })
}

export function insertSNData (parameter) {
  return axios({
    url: api.insertSNData,
    method: 'post',
    data: parameter
  })
}

export function findProductMo (parameter) {
  return axios({
    url: api.findProductMo,
    method: 'post',
    data: parameter
  })
}

export function retriveProductTable (parameter) {
  return axios({
    url: api.retriveProductTable,
    method: 'post',
    data: parameter
  })
}

export function addProductTable (parameter) {
  return axios({
    url: api.addProductTable,
    method: 'post',
    data: parameter
  })
}

export function deleProductTable (parameter) {
  return axios({
    url: api.deleProductTable,
    method: 'post',
    data: parameter
  })
}

export function retiveDegreeTable (parameter) {
  return axios({
    url: api.retiveDegreeTable,
    method: 'post',
    data: parameter
  })
}

export function enableOrDisable (parameter) {
  return axios({
    url: api.enableOrDisable,
    method: 'post',
    data: parameter
  })
}

export function addProductDegree (parameter) {
  return axios({
    url: api.addProductDegree,
    method: 'post',
    data: parameter
  })
}

export function retriveHosData (parameter) {
  return axios({
    url: api.retriveHosData,
    method: 'post',
    data: parameter
  })
}

export function deleHosData (parameter) {
  return axios({
    url: api.deleHosData,
    method: 'post',
    data: parameter
  })
}

export function addHosData (parameter) {
  return axios({
    url: api.addHosData,
    method: 'post',
    data: parameter
  })
}

export function retriveDistData (parameter) {
  return axios({
    url: api.retriveDistData,
    method: 'post',
    data: parameter
  })
}

export function addDistData (parameter) {
  return axios({
    url: api.addDistData,
    method: 'post',
    data: parameter
  })
}

export function deleDistData (parameter) {
  return axios({
    url: api.deleDistData,
    method: 'post',
    data: parameter
  })
}

export function retriveDealersData (parameter) {
  return axios({
    url: api.retriveDealersData,
    method: 'post',
    data: parameter
  })
}

export function retriveHost (parameter) {
  return axios({
    url: api.retriveHost,
    method: 'post',
    data: parameter
  })
}

export function deleDealersData (parameter) {
  return axios({
    url: api.deleDealersData,
    method: 'post',
    data: parameter
  })
}

export function retriveHostProcurement (parameter) {
  return axios({
    url: api.retriveHostProcurement,
    method: 'post',
    data: parameter
  })
}

export function deleHostProcurement (parameter) {
  return axios({
    url: api.deleHostProcurement,
    method: 'post',
    data: parameter
  })
}

export function addHostProcurement (parameter) {
  return axios({
    url: api.addHostProcurement,
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

export function retriveHostName (parameter) {
  return axios({
    url: api.retriveHostName,
    method: 'post',
    data: parameter
  })
}

export function retriveCustName (parameter) {
  return axios({
    url: api.retriveCustName,
    method: 'post',
    data: parameter
  })
}

export function retriveAccreditHost (parameter) {
  return axios({
    url: api.retriveAccreditHost,
    method: 'post',
    data: parameter
  })
}

export function AddDealersHost (parameter) {
  return axios({
    url: api.AddDealersHost,
    method: 'post',
    data: parameter
  })
}

export function deleDealersHost (parameter) {
  return axios({
    url: api.deleDealersHost,
    method: 'post',
    data: parameter
  })
}

export function addDealersData (parameter) {
  return axios({
    url: api.addDealersData,
    method: 'post',
    data: parameter
  })
}

export function modifyRecordDealers (parameter) {
  return axios({
    url: api.modifyRecordDealers,
    method: 'post',
    data: parameter
  })
}

export function detailsHistory (parameter) {
  return axios({
    url: api.detailsHistory,
    method: 'post',
    data: parameter
  })
}

export function getProductType (parameter) {
  return axios({
    url: api.getProductType,
    method: 'post',
    data: parameter
  })
}

export function getModelAndName (parameter) {
  return axios({
    url: api.getModelAndName,
    method: 'post',
    data: parameter
  })
}

export function closeList (parameter) {
  return axios({
    url: api.closeList,
    method: 'post',
    data: parameter
  })
}

export function closeAdd (parameter) {
  return axios({
    url: api.closeAdd,
    method: 'post',
    data: parameter
  })
}

export function closeUpdate (parameter) {
  return axios({
    url: api.closeUpdate,
    method: 'post',
    data: parameter
  })
}

export function getHosMapList (parameter) {
  return axios({
    url: api.getHosMapList,
    method: 'post',
    data: parameter
  })
}

export function addHosMap (parameter) {
  return axios({
    url: api.addHosMap,
    method: 'post',
    data: parameter
  })
}

export function updateHosMap (parameter) {
  return axios({
    url: api.updateHosMap,
    method: 'post',
    data: parameter
  })
}

export function delHosMap (parameter) {
  return axios({
    url: api.delHosMap,
    method: 'post',
    data: parameter
  })
}
