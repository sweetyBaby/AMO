import Mock from 'mockjs2'
import { builder } from '../util'

const allocation = (options) => {
  return builder(
    [{
      'number': '111',
      'date': '2018-07-05 22:22:22',
      'original': '自有A',
      'address': '自有A',
      'createBy': '12'
    }
    ])
}

const reporting = (options) => {
  return builder(
    [{
      key: 1,
      fileNumber: 'RK201901021113',
      fileName: '1.吉林省乐健商贸有限公司.xlsx',
      reporting: '吉林省乐健商贸有限公司',
      reportingPerson: 'Wendy',
      date: '2019-04-15 22:00:13',
      result: '处理成功',
      errorTip: '上报库存日期无对应库存快照日期。',
    }, {
      key: 2,
      fileNumber: 'RK201901021113',
      fileName: '1.吉林省乐健商贸有限公司.xlsx',
      reporting: '吉林省乐健商贸有限公司',
      reportingPerson: 'Wendy',
      date: '2019-04-15 22:00:13',
      result: '处理成功',
      errorTip: '已超过库存上报最大期限，无法上传。',
    }, {
      key: 3,
      fileNumber: 'RK201901021113',
      fileName: '1.吉林省乐健商贸有限公司.xlsx',
      reporting: '吉林省乐健商贸有限公司',
      reportingPerson: 'Wendy',
      date: '2019-04-15 22:00:13',
      result: '处理成功',
      errorTip: '销售单位不正确',
    }])
}
Mock.mock(/\/depot\/allocation/, 'get', allocation)
Mock.mock(/\/depot\/reporting/, 'get', reporting)
