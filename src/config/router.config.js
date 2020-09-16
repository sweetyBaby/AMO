// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页', icon: 'home' },
    redirect: '/dashboard/home/homePage',
    children: [
      // dashboard
      {
        path: '/dashboard',
        redirect: '/dashboard',
        component: RouteView,
        meta: { title: '首页', icon: 'home', permission: ['admin'] },
        children: [
          {
            path: '/dashboard/home',
            name: 'home',
            component: RouteView,
            meta: { title: '首页', permission: ['admin'] },
            children: [
              {
                path: '/dashboard/home/homePage',
                name: 'homePage',
                component: () => import('@/views/dashboard/home/homePage'),
                meta: { title: '工作台', permission: ['admin'] }
              }
            ]
          }
        ]
      },
      {
        path: '/order',
        redirect: '/order/orderWrap',
        component: RouteView,
        meta: { title: '订单', icon: 'order', permission: ['admin'] },
        children: [
          {
            path: '/order/orderWrap',
            name: 'orderWrap',
            component: RouteView,
            meta: { title: '订单管理', permission: ['admin'] },
            children: [
              {
                path: '/order/orderWrap/OrderList',
                name: 'OrderList',
                component: () => import('@/views/order/orderWrap/OrderList'),
                meta: { title: '订单列表', permission: ['admin'] }
              },
              {
                path: '/order/orderWrap/OrderList_Edit',
                name: 'OrderList_Edit',
                component: () => import('@/views/order/orderWrap/OrderList_Edit'),
                meta: { title: '订单新增', permission: ['OrderList_Edit'] }
              },
              {
                path: '/order/orderWrap/OrderList_Detail',
                name: 'OrderList_Detail',
                component: () => import('@/views/order/orderWrap/OrderList_Detail'),
                meta: { title: '订单详情', permission: ['OrderList_Detail'] }
              }
            ]
          }
        ]
      },
      {
        path: '/reservoir',
        redirect: '/reservoir',
        component: RouteView,
        meta: { title: '库管', icon: 'depot', permission: ['admin'] },
        children: [
          {
            path: '/reservoir/Depot',
            name: 'Depot',
            component: RouteView,
            redirect: '/reservoir/Depot',
            meta: { title: '出入库', permission: ['admin'] },
            children: [
              {
                path: '/reservoir/Depot/WareHouse',
                name: 'WareHouse',
                component: () => import('@/views/reservoir/Depot/WareHouse'),
                meta: { title: '产品入库', permission: ['admin'] }
              },
              {
                path: '/reservoir/Depot/WareHouse_Edit',
                name: 'WareHouse_Edit',
                component: () => import('@/views/reservoir/Depot/AddNewWare'),
                meta: { title: '新增产品入库', permission: ['WareHouse_Edit'] }
              },
              {
                path: '/reservoir/Depot/WareHouse_Detail',
                name: 'WareHouse_Detail',
                component: () => import('@/views/reservoir/Depot/ProDetail'),
                meta: { title: '入库单据详情', permission: ['WareHouse_Detail'] }
              },
              {
                path: '/reservoir/Depot/Delivery_Edit',
                name: 'Delivery_Edit',
                component: () => import('@/views/reservoir/Depot/AddNewWare'),
                meta: { title: '新增产品出库', permission: ['Delivery_Edit'] }
              },
              {
                path: '/reservoir/Depot/Delivery_Detail',
                name: 'Delivery_Detail',
                component: () => import('@/views/reservoir/Depot/ProDetail'),
                meta: { title: '出库单据详情', permission: ['Delivery_Detail'] }
              },
              {
                path: '/reservoir/Depot/Delivery',
                name: 'Delivery',
                component: () => import('@/views/reservoir/Depot/Delivery'),
                meta: { title: '产品出库', permission: ['admin'] }
              },

              {
                path: '/reservoir/Depot/FileManagement',
                name: 'FileManagement',
                component: () => import('@/views/reservoir/Depot/FileManagement'),
                meta: { title: '文件管理', permission: ['auditManage'] }
              },
              {
                path: '/reservoir/Depot/FileManagement_Detail',
                name: 'FileManagement_Detail',
                component: () => import('@/views/reservoir/Depot/modules/errorMsg'),
                meta: { title: '文件管理错误详情', permission: ['FileManagement_Detail'] }
              },
              {
                path: '/reservoir/Depot/Drafts',
                name: 'Drafts',
                component: () => import('@/views/reservoir/Depot/Drafts'),
                meta: { title: '草稿箱', permission: ['auditManage'] }
              },
              {
                path: '/reservoir/Depot/AbnormalData',
                name: 'AbnormalData',
                component: () => import('@/views/reservoir/Depot/AbnormalData'),
                meta: { title: '异常数据', permission: ['AbnormalData'] }
              },
              {
                path: '/reservoir/Depot/AbnormalData_Detail',
                name: 'AbnormalData_Detail',
                component: () => import('@/views/reservoir/Depot/AbnormalDetail'),
                meta: { title: '异常数据详情', permission: ['Abnormal_Detail'] }
              }
            ]
          },
          {
            path: '/reservoir/Management',
            name: 'Management',
            component: RouteView,
            redirect: '/reservoir/Management',
            meta: { title: '库存管理', permission: ['admin'] },
            children: [
              {
                path: '/reservoir/Management/Allocation',
                name: 'Allocation',
                component: () => import('@/views/reservoir/Management/Allocation'),
                meta: { title: '产品库位间调拨', permission: ['admin'] }
              },
              {
                path: '/reservoir/Management/Stained',
                name: 'Stained',
                component: () => import('@/views/reservoir/Management/Stained'),
                meta: { title: '污损调拨', permission: ['admin'] }
              },
              {
                path: '/reservoir/Management/Stained_Edit',
                name: 'Stained_Edit',
                component: () => import('@/views/reservoir/modules/ProAllot'),
                meta: { title: '新增污损调拨', permission: ['Stained_Edit'] }
              },
              {
                path: '/reservoir/Management/Stained_Detail',
                name: 'Stained_Detail',
                component: () => import('@/views/reservoir/Depot/ProDetail'),
                meta: { title: '污损调拨详情', permission: ['Stained_Detail'] }
              },
              {
                path: '/reservoir/Management/Allocation_Edit',
                name: 'Allocation_Edit',
                component: () => import('@/views/reservoir/modules/ProAllot'),
                meta: { title: '新增产品调拨', permission: ['Allocation_Edit'] }
              },
              {
                path: '/reservoir/Management/Allocation_Detail',
                name: 'Allocation_Detail',
                component: () => import('@/views/reservoir/Depot/ProDetail'),
                meta: { title: '产品调拨详情', permission: ['Allocation_Detail'] }
              },
              {
                path: '/reservoir/Management/Reporting',
                name: 'Reporting',
                component: () => import('@/views/reservoir/Management/Reporting'),
                meta: { title: '库存上报', permission: ['admin'] }
              },
              {
                path: '/reservoir/Management/Check',
                name: 'Check',
                component: () => import('@/views/reservoir/Management/Check'),
                meta: { title: '库存核查', permission: ['admin'] }
              },
              {
                path: '/reservoir/Management/Snapshot',
                name: 'Snapshot',
                component: () => import('@/views/reservoir/Management/Snapshot'),
                meta: { title: '库存快照', permission: ['admin'] }
              },
              {
                path: '/reservoir/Management/Stock',
                name: 'Stock',
                component: () => import('@/views/reservoir/Management/Stock'),
                meta: { title: '库存表', permission: ['admin'] }
              },
              {
                path: '/reservoir/Management/codeSearch',
                name: 'codeSearch',
                component: () => import('@/views/reservoir/Management/codeSearch'),
                meta: { title: '唯一码追溯查询', permission: ['admin'] }
              }
            ]
          },
          {
            path: '/reservoir/apply',
            name: 'apply',
            component: RouteView,
            redirect: '/reservoir/apply/PreApply',
            meta: { title: '申请', permission: ['admin'] },
            children: [
              {
                path: '/reservoir/apply/PreApply',
                name: 'PreApply',
                component: () => import('@/views/reservoir/apply/PreApply'),
                meta: { title: '预入库申请拒收', permission: ['admin'] }
              },
              {
                path: '/reservoir/apply/ProBackApply',
                name: 'ProBackApply',
                component: () => import('@/views/reservoir/apply/ProBackApply'),
                meta: { title: '申请退货', permission: ['admin'] }
              },
              {
                path: '/reservoir/apply/ReplaceApply',
                name: 'ReplaceApply',
                component: () => import('@/views/reservoir/apply/ReplaceApply'),
                meta: { title: '污损置换申请', permission: ['admin'] }
              },
              {
                path: '/reservoir/apply/Approval',
                name: 'Approval',
                component: () => import('@/views/reservoir/apply/Approval'),
                meta: { title: '预入库拒收审批', permission: ['admin'] }
              },
              {
                path: '/reservoir/apply/GoodApproval',
                name: 'GoodApproval',
                component: () => import('@/views/reservoir/apply/GoodApproval'),
                meta: { title: '产品退货审批', permission: ['admin'] }
              },
              {
                path: '/reservoir/apply/ReplaceApproval',
                name: 'ReplaceApproval',
                component: () => import('@/views/reservoir/apply/ReplaceApply'),
                meta: { title: '污损置换审批', permission: ['admin'] }
              }
            ]
          },
          {
            path: '/reservoir/Estate',
            name: 'apply',
            component: RouteView,
            redirect: '/reservoir/Estate/EstateWare',
            meta: { title: '配送商退货入库', permission: ['admin'] },
            children: [
              {
                path: '/reservoir/Estate/EstateWare',
                name: 'EstateWare',
                component: () => import('@/views/reservoir/Estate/EstateWare'),
                meta: { title: '配送商退货入库', permission: ['admin'] }
              },
              {
                path: '/reservoir/Estate/EstateWare_Add',
                name: 'EstateWare_Add',
                component: () => import('@/views/reservoir/Depot/AddNewWare'),
                meta: { title: '新增配送商退货入库', permission: ['EstateWare_Add'] }
              },
              {
                path: '/reservoir/Estate/EstateWare_Edit',
                name: 'EstateWare_Edit',
                component: () => import('@/views/reservoir/Depot/AddNewWare'),
                meta: { title: '新增配送商退货入库', permission: ['EstateWare_Edit'] }
              },
              {
                path: '/reservoir/Estate/EstateDelivery',
                name: 'EstateDelivery',
                component: () => import('@/views/reservoir/Estate/EstateDelivery'),
                meta: { title: '配送商销售出库', permission: ['EstateDelivery'] }
              },
              {
                path: '/reservoir/Estate/EstateDelivery_Edit',
                name: 'EstateDelivery_Edit',
                component: () => import('@/views/reservoir/Depot/AddNewWare'),
                meta: { title: '新增配送商销售出库', permission: ['EstateDelivery_Edit'] }
              },
              {
                path: '/reservoir/Estate/EstateWare_Detail',
                name: 'EstateWare_Detail',
                component: () => import('@/views/reservoir/Depot/ProDetail'),
                meta: { title: '配送商退货入库详情', permission: ['EstateWare_Detail'] }
              },
              {
                path: '/reservoir/Estate/EstateDelivery_Detail',
                name: 'EstateDelivery_Detail',
                component: () => import('@/views/reservoir/Depot/ProDetail'),
                meta: { title: '配送商销售出库详情', permission: ['EstateDelivery_Detail'] }
              }
            ]
          }
        ]
      },
      {
        path: '/auditManage',
        redirect: '/auditManage',
        component: RouteView,
        meta: { title: '发票', icon: 'invoice', permission: ['admin'] },
        children: [
          {
            path: '/auditManage/auditWrap',
            component: RouteView,
            redirect: '/auditManage/auditWrap',
            meta: { title: '发票管理', permission: ['admin'] },
            children: [
              {
                path: '/auditManage/auditWrap/AuditManage',
                name: 'AuditManage',
                component: () => import('@/views/auditManage/auditWrap/AuditManage'),
                meta: { title: '发票管理', permission: ['admin'] }
              },
              {
                path: '/auditManage/auditWrap/AuditManage_Edit',
                name: 'AuditManage_Edit',
                component: () => import('@/views/auditManage/auditWrap/modules/auditEdit'),
                meta: { title: '发票新增', permission: ['AuditManage_Edit'] }
              },
              {
                path: '/auditManage/auditWrap/AuditManage_Detail',
                name: 'AuditManage_Detail',
                component: () => import('@/views/auditManage/auditWrap/modules/auditEdit'),
                meta: { title: '发票详情', permission: ['AuditManage_Detail'] }
              },
              {
                path: '/auditManage/auditWrap/OutVoucher',
                name: 'OutVoucher',
                component: () => import('@/views/auditManage/auditWrap/OutVoucher'),
                meta: { title: '出入库单凭证', permission: ['admin'] }
              },
              {
                path: '/auditManage/auditWrap/OutVoucher_Edit',
                name: 'OutVoucher_Edit',
                component: () => import('@/views/auditManage/auditWrap/OutVoucher_Edit'),
                meta: { title: '新增出入库单凭证', permission: ['OutVoucher_Edit'] }
              },
              {
                path: '/auditManage/auditWrap/InvoiceAudit',
                name: 'InvoiceAudit',
                component: () => import('@/views/auditManage/auditWrap/InvoiceAudit'),
                meta: { title: '发票审计', permission: ['admin'] }
              },
              {
                path: '/auditManage/auditWrap/InvoiceAudit_Edit',
                name: 'InvoiceAudit_Edit',
                component: () => import('@/views/auditManage/auditWrap/AuditList'),
                meta: { title: '发票审计结果', permission: ['InvoiceAudit_Edit'] }
              },
              {
                path: '/auditManage/auditWrap/InvoiceAudit_Detail',
                name: 'InvoiceAudit_Detail',
                component: () => import('@/views/auditManage/auditWrap/Audit_Detail'),
                meta: { title: '发票审计详情', permission: ['InvoiceAudit_Detail'] }
              },
              {
                path: '/auditManage/auditWrap/InvoiceFile',
                name: 'InvoiceFile',
                component: () => import('@/views/auditManage/auditWrap/InvoiceFile'),
                meta: { title: '发票文件管理', permission: ['admin'] }
              },
              {
                path: '/auditManage/auditWrap/InvoiceFile_Detail',
                name: 'InvoiceFile_Detail',
                component: () => import('@/views/reservoir/Depot/modules/errorMsg'),
                meta: { title: '发票文件错误详情', permission: ['InvoiceFile_Detail'] }
              },
              {
                path: '/auditManage/auditWrap/RedReverse',
                name: 'RedReverse',
                component: () => import('@/views/auditManage/auditWrap/RedReverse'),
                meta: {
                  title: '红冲销量',
                  permission: ['admin']
                }
              },
              {
                path: '/auditManage/auditWrap/RedReverse_Edit',
                name: 'RedReverse_Edit',
                component: () => import('@/views/auditManage/auditWrap/RedReverse_Edit'),
                meta: {
                  title: '新增红冲销量',
                  permission: ['RedReverse_Edit']
                }
              },
            ]
          },
          {
            path: '/auditManage/estateAudit',
            component: RouteView,
            redirect: '/auditManage/estateAudit/PerfessionWrap',
            meta: { title: '配送商发票', permission: ['admin'] },
            children: [
              {
                path: '/auditManage/estateAudit/PerfessionWrap',
                name: 'PerfessionWrap',
                component: () => import('@/views/auditManage/estateAudit/PerfessionWrap'),
                meta: { title: '配送商发票第一段', permission: ['admin'] }
              },
              {
                path: '/auditManage/estateAudit/PerfessionWrapSecond',
                name: 'PerfessionWrapSecond',
                component: () => import('@/views/auditManage/estateAudit/PerfessionWrapSecond'),
                meta: { title: '配送商发票第二段', permission: ['admin'] }
              },
              {
                path: '/auditManage/estateAudit/PerfessionSecond_Edit',
                name: 'PerfessionSecond_Edit',
                component: () => import('@/views/auditManage/estateAudit/PerfessionSecond_Edit'),
                meta: { title: '配送商发票第二段新增', permission: ['admin'] }
              },
              {
                path: '/auditManage/estateAudit/PerfessionWrap_Edit',
                name: 'PerfessionWrap_Edit',
                component: () => import('@/views/auditManage/auditWrap/modules/auditEdit'),
                meta: { title: '配送商发票新增', permission: ['PerfessionWrap_Edit'] }
              },
              {
                path: '/auditManage/estateAudit/PerfessionWrap_Detail',
                name: 'PerfessionWrap_Detail',
                component: () => import('@/views/auditManage/estateAudit/PerfessionWrap_Detail'),
                meta: { title: '配送商发票详情', permission: ['PerfessionWrap_Detail'] }
              },
              {
                path: '/auditManage/auditWrap/EstateRedReverse',
                name: 'EstateRedReverse',
                component: () => import('@/views/auditManage/auditWrap/EstateRedReverse'),
                meta: {
                  title: '配送商红冲销量',
                  permission: ['admin']
                }
              },
              {
                path: '/auditManage/auditWrap/RedReverse_Edit',
                name: 'EstateRedReverse_Edit',
                component: () => import('@/views/auditManage/auditWrap/RedReverse_Edit'),
                meta: {
                  title: '新增配送商红冲销量',
                  permission: ['EstateRedReverse_Edit']
                }
              },
            ]
          },
          {
            path: '/auditManage/supplement',
            component: RouteView,
            redirect: '/auditManage/supplement/InvoiceSupplement',
            meta: { title: '补传销量', permission: ['admin'] },
            children: [
              {
                path: '/auditManage/supplement/InvoiceSupplement',
                name: 'InvoiceSupplement',
                component: () => import('@/views/auditManage/auditWrap/InvoiceSupplement'),
                meta: { title: '补传发票', permission: ['admin'] }
              },
              {
                path: '/auditManage/supplement/OutVoucherSupple',
                name: 'OutVoucherSupple',
                component: () => import('@/views/auditManage/auditWrap/OutVoucherSupple'),
                meta: { title: '补传出入库单凭证', permission: ['admin'] }
              },
              {
                path: '/auditManage/supplement/OutVoucherSupple_Edit',
                name: 'OutVoucherSupple_Edit',
                component: () => import('@/views/auditManage/auditWrap/OutVoucher_Edit'),
                meta: { title: '新增出入库单凭证补传', permission: ['OutVoucherSupple_Edit'] }
              },
              {
                path: '/auditManage/supplement/PerfessionSupple',
                name: 'PerfessionSupple',
                component: () => import('@/views/auditManage/estateAudit/PerfessionSupple'),
                meta: { title: '补传配送商发票', permission: ['admin'] }
              }
            ]
          },
          {
            path: '/auditManage/appeal',
            component: RouteView,
            redirect: '/auditManage/appeal/VolumReport',
            meta: { title: '销量申诉', permission: ['admin'] },
            children: [
              {
                path: '/auditManage/appeal/VolumReport',
                name: 'VolumReport',
                component: () => import('@/views/auditManage/auditWrap/VolumReport'),
                meta: { title: '销量申诉', permission: ['admin'] }
              },
              {
                path: '/auditManage/appeal/OutVoucherAppeal',
                name: 'OutVoucherAppeal',
                component: () => import('@/views/auditManage/auditWrap/OutVoucherAppeal'),
                meta: { title: '出入库单凭证申诉', permission: ['admin'] }
              },
              {
                path: '/auditManage/appeal/OutVoucherAppeal_Edit',
                name: 'OutVoucherAppeal_Edit',
                component: () => import('@/views/auditManage/auditWrap/OutVoucher_Edit'),
                meta: { title: '新增出入库单凭证申诉', permission: ['OutVoucherAppeal_Edit'] }
              },
              {
                path: '/auditManage/appeal/PerfessionAppeal',
                name: 'PerfessionAppeal',
                component: () => import('@/views/auditManage/estateAudit/PerfessionAppeal'),
                meta: { title: '配送商发票申诉', permission: ['admin'] }
              }
            ]
          }
        ]
      },
      {
        path: '/dataRemind',
        component: RouteView,
        redirect: '/dataRemind',
        meta: { title: '数据与提醒', icon: 'remind', permission: ['table'] },
        children: [
          {
            path: '/dataRemind/unusualRemind',
            redirect: '/dataRemind/unusualRemind',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: RouteView,
            meta: { title: '异常提醒', keepAlive: true, permission: ['table'] },
            children: [
              {
                path: '/dataRemind/unusualRemind/InventoryWarn',
                name: 'InventoryWarn',
                component: () => import('@/views/dataRemind/unusualRemind/InventoryWarn'),
                meta: { title: '库存预警', permission: ['table'] }
              },
              {
                path: '/dataRemind/unusualRemind/FailureWarn',
                name: 'FailureWarn',
                component: () => import('@/views//dataRemind/unusualRemind/FailureWarn'),
                meta: { title: '失效预警', permission: ['table'] }
              },
              {
                path: '/dataRemind/unusualRemind/DistributorsWarn',
                name: 'DistributorsWarn',
                component: () => import('@/views//dataRemind/unusualRemind/DistributorsWarn'),
                meta: { title: '配送商备案效期预警', permission: ['table'] }
              },
              {
                path: '/dataRemind/unusualRemind/AfficheManage',
                name: 'AfficheManage',
                component: () => import('@/views/dataRemind/unusualRemind/AfficheManage'),
                meta: { title: '公告管理', permission: ['table'] }
              },
              {
                path: '/dataRemind/unusualRemind/MessageTable',
                name: 'MessageTable',
                component: () => import('@/views/dataRemind/unusualRemind/MessageTable'),
                meta: { title: '消息提醒', permission: ['table'] }
              }
            ]
          }
        ]
      },
      // profile
      {
        path: '/analysis',
        component: RouteView,
        redirect: '/analysis',
        meta: { title: '统计分析', icon: 'analysis', permission: ['profile'] },
        children: [
          {
            path: '/analysis/analysisWrap',
            name: 'analysisWrap',
            component: RouteView,
            meta: { title: '统计分析', permission: ['profile'] },
            children: [
              {
                path: '/analysis/analysisWrap/access',
                name: 'access',
                component: () => import('@/views/analysis/analysisWrap/access'),
                meta: { title: '出入库统计', permission: ['exception'] }
              },
              {
                path: '/analysis/analysisWrap/summary',
                name: 'summary',
                component: () => import('@/views/analysis/analysisWrap/summary'),
                meta: { title: '库位汇总统计', permission: ['exception'] }
              },
              {
                path: '/analysis/analysisWrap/sales',
                name: 'sales',
                component: () => import('@/views/analysis/analysisWrap/sales'),
                meta: { title: '经销商销量统计', permission: ['exception'] }
              },
              {
                path: '/analysis/analysisWrap/MonthReport',
                name: 'MonthReport',
                component: () => import('@/views/analysis/analysisWrap/MonthReport'),
                meta: { title: '月报', permission: ['exception'] }
              },
              {
                path: '/analysis/analysisWrap/ZeroReport',
                name: 'ZeroReport',
                component: () => import('@/views/analysis/analysisWrap/ZeroReport'),
                meta: { title: '"0"统计', permission: ['exception'] }
              },
              {
                path: '/analysis/analysisWrap/SalesReport',
                name: 'SalesReport',
                component: () => import('@/views/analysis/analysisWrap/SalesReport'),
                meta: { title: '销量报表', permission: ['admin'] }
              }
            ]
          }
        ]
      },
      {
        path: '/more',
        redirect: '/more',
        component: RouteView,
        meta: { title: '更多', icon: 'menuMore', permission: ['auditManage'] },
        children: [
          {
            path: '/more/basicInfo',
            name: 'basicInfo',
            component: RouteView,
            redirect: '/more/basicInfo',
            meta: { title: '主数据查询', permission: ['auditManage'] },
            children: [
              {
                path: '/more/basicInfo/HosData',
                name: 'HosData',
                component: () => import('@/views/more/basicInfo/HosData'),
                meta: { title: '医院主数据查询', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/HostProcurement',
                name: 'HostProcurement',
                component: () => import('@/views/more/basicInfo/HostProcurement'),
                meta: { title: '医院采购代理机构', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/ProductData',
                name: 'ProductData',
                component: () => import('@/views/more/basicInfo/ProductData'),
                meta: { title: '产品主数据查询', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/ProductSN',
                name: 'ProductSN',
                component: () => import('@/views/more/basicInfo/ProductSN'),
                meta: { title: '产品SN查询', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/DealersData',
                name: 'DealersData',
                component: () => import('@/views/more/basicInfo/DealersData'),
                meta: { title: '经销商主数据查询', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/DealersAccreditHost',
                name: 'DealersAccreditHost',
                component: () => import('@/views/more/basicInfo/DealersAccreditHost'),
                meta: { title: '经销商授权医院', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/DealersDistributors',
                name: 'DealersDistributors',
                component: () => import('@/views/more/basicInfo/DealersDistributors'),
                meta: { title: '配送商查询', permission: ['auditManage'] }
              },
              {
                path: '/more/basicInfo/RelationShip',
                name: 'RelationShip',
                component: () => import('@/views/more/basicInfo/RelationShip'),
                meta: { title: '医院授权关系', permission: ['RelationShip'] }
              },
              {
                path: '/more/basicInfo/RelationShip_Edit',
                name: 'RelationShip_Edit',
                component: () => import('@/views/more/basicInfo/RelationShip_Edit'),
                meta: { title: '医院授权关系编辑', permission: ['RelationShip_Edit'] }
              },
              {
                path: '/more/basicInfo/RelationShip_Detail',
                name: 'RelationShip_Detail',
                component: () => import('@/views/more/basicInfo/RelationShip_Detail'),
                meta: { title: '医院授权关系详情', permission: ['RelationShip_Detail'] }
              }
            ]
          },
          {
            path: '/more/information',
            name: 'information',
            component: RouteView,
            redirect: '/more/information',
            meta: { title: '基础信息', icon: 'tool', keepAlive: true, permission: ['auditManage'] },
            children: [
              {
                path: '/more/information/BasicInformationData',
                name: 'BasicInformationData',
                component: () => import('@/views/more/information/BasicInformationData'),
                meta: { title: '基础信息设置', permission: ['auditManage'] }
              }, {
                path: '/more/information/MyCustomer',
                name: 'MyCustomer',
                component: () => import('@/views/more/information/MyCustomer'),
                meta: { title: '我的客户', permission: ['auditManage'] }
              }, {
                path: '/more/information/AutoCustomer',
                name: 'AutoCustomer',
                component: () => import('@/views/more/information/AutoCustomer'),
                meta: { title: '自定义开票名称', permission: ['auditManage'] }
              }, {
                path: '/more/information/MyProduct',
                name: 'MyProduct',
                component: () => import('@/views/more/information/MyProduct'),
                meta: { title: '我的产品', permission: ['auditManage'] }
              },
              {
                path: '/more/information/LocationManagement',
                name: 'LocationManagement',
                component: () => import('@/views/more/information/LocationManagement'),
                meta: { title: '库位管理', permission: ['auditManage'] }
              },
              {
                path: '/more/information/CloseAccount',
                name: 'CloseAccount',
                component: () => import('@/views/more/information/CloseAccount'),
                meta: { title: '关账设置', permission: ['auditManage'] }
              },
              {
                path: '/more/information/AppealSet',
                name: 'AppealSet',
                component: () => import('@/views/more/information/AppealSet'),
                meta: { title: '申诉设置', permission: ['auditManage'] }
              },
              {
                path: '/more/information/PersonalCenterData',
                name: 'PersonalCenterData',
                component: () => import('@/views/more/information/PersonalCenterData'),
                meta: { title: '个人中心', permission: ['auditManage'] }
              },
              {
                path: '/more/information/ContractManage',
                name: 'ContractManage',
                component: () => import('@/views/more/information/ContractManage'),
                meta: { title: '合同管理', permission: ['auditManage'] }
              },
              {
                path: '/more/information/MyHospitalSales',
                name: 'MyHospitalSales',
                component: () => import('@/views/more/information/MyHospitalSales'),
                meta: { title: '我的医院销售指标', permission: ['auditManage'] }
              },
              {
                path: '/more/information/MyHospitalSales_Detail',
                name: 'MyHospitalSales_Detail',
                component: () => import('@/views/more/information/HospitalSales_Detail'),
                meta: { title: '我的医院指标详情', permission: ['auditManage'] }
              },
              {
                path: '/more/information/HospitalSales',
                name: 'HospitalSales',
                component: () => import('@/views/more/information/HospitalSales'),
                meta: { title: '医院销售指标', permission: ['auditManage'] }
              },
              {
                path: '/more/information/HospitalSales_Detail',
                name: 'HospitalSales_Detail',
                component: () => import('@/views/more/information/HospitalSales_Detail'),
                meta: { title: '医院销售指标详情', permission: ['auditManage'] }
              },
              {
                path: '/more/information/HosSaleRate',
                name: 'HosSaleRate',
                component: () => import('@/views/more/information/HosSaleRate'),
                meta: { title: '指标达成率', permission: ['auditManage'] }
              },
              {
                path: '/more/information/HosSaleRate_Edit',
                name: 'HosSaleRate_Edit',
                component: () => import('@/views/more/information/HosRate_Edit'),
                meta: { title: '指标达成率详情', permission: ['HosSaleRate_Edit'] }
              }
            ]
          },
          {
            path: '/more/set',
            redirect: '/more/set',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: RouteView,
            meta: { title: '设置', keepAlive: true, permission: ['auditManage'] },
            children: [
              {
                path: '/more/set/PurviewUser',
                name: 'PurviewUser',
                component: () => import('@/views/more/set/PurviewUser'),
                meta: { title: '用户管理', permission: ['auditManage'] }
              },
              {
                path: '/more/set/RoleManage',
                name: 'RoleManage',
                component: () => import('@/views/more/set/RoleManage'),
                meta: { title: '角色管理', permission: ['auditManage'] }
              },
              {
                path: '/more/set/MenuManage',
                name: 'MenuManage',
                component: () => import('@/views/more/set/MenuManage'),
                meta: { title: '菜单管理', permission: ['auditManage'] }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

// export const asyncRouterMap = generatorDynamicRouter().then(routers => {
//  return routers
// })

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
