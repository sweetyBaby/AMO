import Vue from 'vue'
import { axios } from '@/utils/request'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
// eslint-disable-next-line no-unused-vars
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
import { getLoginMenu } from '@/api/auth'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 你需要动态引入的页面组件
  dashbord: () => import('@/views/dashboard/home/homePage'),
  homePage: () => import('@/views/dashboard/home/homePage'),
  userCenter: () => import('@/views/dashboard/home/userCenter'),
  printPage: () => import('@/views/print/PrintPage'),
  storageOut: () => import('@/views/storageManage/StorageOut'),
  whouseInfo: () => import('@/views/storageManage/warehouseInfo'),
  shelfManage: () => import('@/views/storageManage/shelfManagement'),
  whouseStock: () => import('@/views/storageManage/warehouseStatistics'),
  whouseAllot: () => import('@/views/storageManage/warehouseTransfer'),
  PurviewUser: () => import('@/views/more/set/PurviewUser'),
  RoleManage: () => import('@/views/more/set/RoleManage'),
  MenuManage: () => import('@/views/more/set/MenuManage'),
  // 订单管理
  OrderList: () => import('@/views/order/orderWrap/OrderList'),
  OrderList_Edit: () => import('@/views/order/orderWrap/OrderList_Edit'),
  OrderList_Detail: () => import('@/views/order/orderWrap/OrderList_Detail'),
  // 出入库
  WareHouse: () => import('@/views/reservoir/Depot/WareHouse'),
  WareHouse_Detail: () => import('@/views/reservoir/Depot/ProDetail'),
  WareHouse_Edit: () => import('@/views/reservoir/Depot/AddNewWare'),
  Delivery_Detail: () => import('@/views/reservoir/Depot/ProDetail'),
  Delivery_Edit: () => import('@/views/reservoir/Depot/AddNewWare'),
  Delivery: () => import('@/views/reservoir/Depot/Delivery'),
  ProPage: () => import('@/views/reservoir/Depot/ProPage'),
  Drafts: () => import('@/views/reservoir/Depot/Drafts'),
  FileManagement: () => import('@/views/reservoir/Depot/FileManagement'),
  FileManagement_Detail: () => import('@/views/reservoir/Depot/modules/errorMsg'),
  AbnormalData: () => import('@/views/reservoir/Depot/AbnormalData'),
  AbnormalData_Detail: () => import('@/views/reservoir/Depot/AbnormalDetail'),
  EstateWare_Detail: () => import('@/views/reservoir/Depot/ProDetail'),
  EstateDelivery_Detail: () => import('@/views/reservoir/Depot/ProDetail'),
  // 库存管理
  Allocation: () => import('@/views/reservoir/Management/Allocation'),
  Allocation_Detail: () => import('@/views/reservoir/Depot/ProDetail'),
  Stained: () => import('@/views/reservoir/Management/Stained'),
  Stained_Detail: () => import('@/views/reservoir/Depot/ProDetail'),
  Allocation_Edit: () => import('@/views/reservoir/modules/ProAllot'),
  Stained_Edit: () => import('@/views/reservoir/modules/ProAllot'),
  Reporting: () => import('@/views/reservoir/Management/Reporting'),
  Check: () => import('@/views/reservoir/Management/Check'),
  Snapshot: () => import('@/views/reservoir/Management/Snapshot'),
  Stock: () => import('@/views/reservoir/Management/Stock'),
  codeSearch: () => import('@/views/reservoir/Management/codeSearch'),
  // initReporting: () => import('@/views/reservoir/Management/initReporting'),
  // 申请
  PreApply: () => import('@/views/reservoir/apply/PreApply'),
  ProBackApply: () => import('@/views/reservoir/apply/ProBackApply'),
  Approval: () => import('@/views/reservoir/apply/Approval'),
  GoodApproval: () => import('@/views/reservoir/apply/GoodApproval'),
  ReplaceApply: () => import('@/views/reservoir/apply/ReplaceApply'),
  ReplaceApproval: () => import('@/views/reservoir/apply/ReplaceApply'),
  // 三产业务
  EstateWare: () => import('@/views/reservoir/Estate/EstateWare'),
  EstateWare_Add: () => import('@/views/reservoir/Depot/AddNewWare'),
  EstateDelivery: () => import('@/views/reservoir/Estate/EstateDelivery'),
  EstateWare_Edit: () => import('@/views/reservoir/Depot/AddNewWare'),
  EstateDelivery_Edit: () => import('@/views/reservoir/Depot/AddNewWare'),
  // 发票管理
  AuditManage: () => import('@/views/auditManage/auditWrap/AuditManage'),
  AuditManage_Edit: () => import('@/views/auditManage/auditWrap/modules/auditEdit'),
  AuditManage_Detail: () => import('@/views/auditManage/auditWrap/modules/auditEdit'),
  InvoiceAudit: () => import('@/views/auditManage/auditWrap/InvoiceAudit'),
  InvoiceAudit_Detail: () => import('@/views/auditManage/auditWrap/Audit_Detail'),
  PerfessionWrap: () => import('@/views/auditManage/estateAudit/PerfessionWrap'),
  PerfessionWrap_Edit: () => import('@/views/auditManage/auditWrap/modules/auditEdit'),
  PerfessionWrap_Detail: () => import('@/views/auditManage/estateAudit/PerfessionWrap_Detail'),
  PerfessionAppeal: () => import('@/views/auditManage/estateAudit/PerfessionAppeal'),
  // InvoiceAudit: () => import('@/views/auditManage/auditWrap/InvoiceAudit'),
  InvoiceAudit_Edit: () => import('@/views/auditManage/auditWrap/AuditList'),
  OutVoucher: () => import('@/views/auditManage/auditWrap/OutVoucher'),
  OutVoucher_Edit: () => import('@/views/auditManage/auditWrap/OutVoucher_Edit'),
  OutVoucherAppeal_Edit: () => import('@/views/auditManage/auditWrap/OutVoucher_Edit'),
  OutVoucherSupple_Edit: () => import('@/views/auditManage/auditWrap/OutVoucher_Edit'),
  InvoiceFile: () => import('@/views/auditManage/auditWrap/InvoiceFile'),
  InvoiceFile_Detail: () => import('@/views/reservoir/Depot/modules/errorMsg'),
  InvoiceSupplement: () => import('@/views/auditManage/auditWrap/InvoiceSupplement'),
  VolumReport: () => import('@/views/auditManage/auditWrap/VolumReport'),
  OutVoucherSupple: () => import('@/views/auditManage/auditWrap/OutVoucherSupple'),
  OutVoucherAppeal: () => import('@/views/auditManage/auditWrap/OutVoucherAppeal'),
  PerfessionSupple: () => import('@/views/auditManage/estateAudit/PerfessionSupple'),
  // 异常提醒
  InventoryWarn: () => import('@/views/dataRemind/unusualRemind/InventoryWarn'),
  FailureWarn: () => import('@/views/dataRemind/unusualRemind/FailureWarn'),
  DistributorsWarn: () => import('@/views/dataRemind/unusualRemind/DistributorsWarn'),
  MessageTable: () => import('@/views/dataRemind/unusualRemind/MessageTable'),
  AfficheManage: () => import('@/views/dataRemind/unusualRemind/AfficheManage'),

  // 主数据查询
  HosData: () => import('@/views/more/basicInfo/HosData'),
  HostProcurement: () => import('@/views/more/basicInfo/HostProcurement'),
  ProductData: () => import('@/views/more/basicInfo/ProductData'),
  ProductSN: () => import('@/views/more/basicInfo/ProductSN'),
  DealersData: () => import('@/views/more/basicInfo/DealersData'),
  DealersAccreditHost: () => import('@/views/more/basicInfo/DealersAccreditHost'),
  DealersDistributors: () => import('@/views/more/basicInfo/DealersDistributors'),
  RelationShip: () => import('@/views/more/basicInfo/RelationShip'),
  RelationShip_Edit: () => import('@/views/more/basicInfo/RelationShip_Edit'),
  RelationShip_Detail: () => import('@/views/more/basicInfo/RelationShip_Detail'),
  // 基础数据
  BasicInformationData: () => import('@/views/more/information/BasicInformationData'),
  MyCustomer: () => import('@/views/more/information/MyCustomer'),
  AutoCustomer: () => import('@/views/more/information/AutoCustomer'),
  MyProduct: () => import('@/views/more/information/MyProduct'),
  LocationManagement: () => import('@/views/more/information/LocationManagement'),
  PersonalCenterData: () => import('@/views/more/information/PersonalCenterData'),
  CloseAccount: () => import('@/views/more/information/CloseAccount'),
  AppealSet: () => import('@/views/more/information/AppealSet'),
  ContractManage: () => import('@/views/more/information/ContractManage'),
  HospitalSales: () => import('@/views/more/information/HospitalSales'),
  MyHospitalSales: () => import('@/views/more/information/MyHospitalSales'),
  HosSaleRate: () => import('@/views/more/information/HosSaleRate'),
  HosSaleRate_Edit: () => import('@/views/more/information/HosRate_Edit'),
  MyHospitalSales_Detail: () => import('@/views/more/information/HospitalSales_Detail'),
  HospitalSales_Detail: () => import('@/views/more/information/HospitalSales_Detail'),

  // 统计分析
  access: () => import('@/views/analysis/analysisWrap/access'),
  summary: () => import('@/views/analysis/analysisWrap/summary'),
  sales: () => import('@/views/analysis/analysisWrap/sales'),
  MonthReport: () => import('@/views/analysis/analysisWrap/MonthReport'),
  ZeroReport: () => import('@/views/analysis/analysisWrap/ZeroReport'),
  SalesReport: () => import('@/views/analysis/analysisWrap/SalesReport')
  // ...more
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/user/dynamic-menu',
    method: 'get'
    /* headers: {
      'Access-Token': 'xxx'
    }
    */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getLoginMenu().then(res => {
      const result = [res.data]
      const routers = generator(result)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
    // getLeftTree().then(res => {
    //   console.info(res)
    //   const result = res.result
    //   const routers = generator(result)
    //   routers.push(notFoundRouter)
    //   resolve(routers)
    // }).catch(err => {
    //   reject(err)
    // })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // console.info('item---',item)
    const newPath = item.key
    let target = ''
    let redirect = null
    const token = Vue.ls.get(ACCESS_TOKEN)
    redirect = 'http://39.100.103.47:8000/thirdInventory/1/1/' + token
    if (newPath.indexOf('thirdInventory') !== -1) {
      target = '_blank'
    }
    // console.info('target---', target)
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      key: item.menuNo,
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, permission: item.key && [item.key] || null, metaNo: item.menuNo, keepAlive: false, target: target }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    if (currentRouter.path.indexOf('thirdInventory') !== -1) {
      currentRouter.path = redirect
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
