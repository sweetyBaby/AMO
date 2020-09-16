import Mock from 'mockjs2'
import { builder } from '../util'

const auditManage = (options) => {
  return builder(
    {
      data: [{
        key: 1,
        date: '2019-04-15',
        number: '42811714',
        code: '3700172350',
        checkcCode: '**** **** ***7 58972',
        type: '增值税普通发票',
        seller: '北京美迪森尼医疗器材销售',
        buyer: '中国医学科学院阜外医院',
        price: '100',
        latterSix: '123456',
        inputType: '扫码识别',
        status: '正常',
      }, {
        key: 2,
        date: '2019-04-15',
        number: '42811714',
        code: '3700172350',
        checkcCode: '**** **** ***7 58972',
        type: '增值税普通发票',
        seller: '北京美迪森尼医疗器材销售',
        buyer: '中国医学科学院阜外医院',
        price: '100',
        latterSix: '123456',
        inputType: '扫码识别',
        status: '正常',
      }, {
        key: 3,
        date: '2019-04-15',
        number: '42811714',
        code: '3700172350',
        checkcCode: '**** **** ***7 58972',
        type: '增值税普通发票',
        seller: '北京美迪森尼医疗器材销售',
        buyer: '中国医学科学院阜外医院',
        price: '100',
        latterSix: '123456',
        inputType: '扫码识别',
        status: '正常',
      }],
      endRow: 6,
      firstPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      isFirstPage: true,
      isLastPage: true,
      lastPage: 1,
      navigateFirstPage: 1,
      navigateLastPage: 1,
      navigatePages: 8,
      navigatepageNums: [1],
      nextPage: 0,
      pageNum: 1,
      pageSize: 7,
      pages: 1,
      prePage: 0,
      size: 7,
      startRow: 0,
      total: 7
    })
}

const invoiceScan = (options) => {
  return builder(
    [
      { code: 5300183130,
        invoiceType: '增值税专用发票',
        invoiceDate: '2019年05月06日',
        invoiceNumber: 5300313086,
        buyer: '厦门市儿童医院',
        seller: '无锡医迈德有限公司',
        money: 1245.00,
        latterSix: 124500,
        status: '正常',
        notes: '无'
      },
      { code: 5300183130,
        invoiceType: '增值税专用发票',
        invoiceDate: '2019年05月06日',
        invoiceNumber: 5300313086,
        buyer: '厦门市儿童医院',
        seller: '无锡医迈德有限公司',
        money: 1245.00,
        latterSix: 124500,
        status: '正常',
        notes: '无'
      }
    ]
  )
}
Mock.mock(/\/auditManage\/auditManage/, 'get', auditManage)
Mock.mock(/\/auditManage\/invoiceScan/, 'get', invoiceScan)
