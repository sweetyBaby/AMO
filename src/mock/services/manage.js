import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const totalCount = 5701

const serverList = (options) => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: 'No ' + tmpKey,
      description: '这是一段描述',
      callNo: Mock.mock('@integer(1, 999)'),
      status: Mock.mock('@integer(0, 3)'),
      updatedAt: Mock.mock('@datetime'),
      editable: false,
      number: Mock.mock('@integer(0, 50)'),
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const auditData = () => {
  return builder({
    'data': [
      {
        key: '1001',
        id: '1001',
        auditName: '张三',
        auditAdress: '江苏省无锡市',
        concat: '张三',
        tel: '15106170632',
        status: '1',
        creatUser: '张三',
        creatTime: '15110039932',
        lastAudit: '李四',
        auditTime: '15755793545',
        auditCounts: '0'
      }, {
        key: '1002',
        id: '1002',
        auditName: '张三',
        auditAdress: '江苏省无锡市',
        concat: '张三',
        tel: '15106170632',
        status: '2',
        creatUser: '张三',
        creatTime: '15110039932',
        lastAudit: '李四',
        auditTime: '15755793545',
        auditCounts: '0'
      }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 3,
    'totalCount': 37
  })
}

const orderData = () => {
  return builder({
    'data': [
      {
        key: '1001',
        id: '1001',
        orderData: '2019-03-22',
        orderNum: 'CGRKD-20181030-041',
        orderStatus: '3',
        paymentStatus: '1',
        wareStatus: '2',
        ticketStatus: '3',
        orderAmount: '19100.00',
        paidBalance: '0.00',
        ticketArrived: '19100.00',
        orderUser: '张三'
      },
      {
        key: '1002',
        id: '1002',
        orderData: '2019-03-23',
        orderNum: 'CGRKD-20181030-041',
        orderStatus: '3',
        paymentStatus: '2',
        wareStatus: '1',
        ticketStatus: '2',
        orderAmount: '19100.00',
        paidBalance: '0.00',
        ticketArrived: '19100.00',
        orderUser: '李四'
      }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  })
}

const productData = () => {
  return builder({
    'data': [
      {
        key: '1001',
        id: '1001',
        proImag: '2019-03-22',
        proName: '得力（deli） 9563 加厚型一次.',
        proCode: '05235',
        proMyCode: '05235',
        proMyName: '得力（deli） 9563 加厚型一次.',
        dist: '强生医疗',
        unit: '条',
        price: '30.00'
      },
      {
        key: '1002',
        id: '1002',
        proImag: '2019-03-22',
        proName: '得力（deli） 9563 加厚型一次.',
        proCode: '05235',
        proMyCode: '05235',
        proMyName: '得力（deli） 9563 加厚型一次.',
        dist: '强生医疗',
        unit: '条',
        price: '30.00'
      }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  })
}

const projects = () => {
  return builder({
    'data': [{
      id: 1,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      title: 'Alipay',
      description: '那是一种内在的东西， 他们到达不了，也无法触及的',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 2,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      title: 'Angular',
      description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 3,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      title: 'Ant Design',
      description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 4,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      title: 'Ant Design Pro',
      description: '那时候我只会想自己想要什么，从不想自己拥有什么',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 5,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      title: 'Bootstrap',
      description: '凛冬将至',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 6,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
      title: 'Vue',
      description: '生命就像一盒巧克力，结果往往出人意料',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 6,
    'totalCount': 57
  })
}

const activity = () => {
  return builder([{
    id: 1,
    user: {
      nickname: '@name',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    },
    project: {
      name: '白鹭酱油开发组',
      action: '更新',
      event: '番组计划'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 1,
    user: {
      nickname: '蓝莓酱',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
    },
    project: {
      name: '白鹭酱油开发组',
      action: '更新',
      event: '番组计划'
    },
    time: '2018-08-23 09:35:37'
  },
  {
    id: 1,
    user: {
      nickname: '@name',
      avatar: '@image(64x64)'
    },
    project: {
      name: '白鹭酱油开发组',
      action: '创建',
      event: '番组计划'
    },
    time: '2017-05-27 00:00:00'
  },
  {
    id: 1,
    user: {
      nickname: '曲丽丽',
      avatar: '@image(64x64)'
    },
    project: {
      name: '高逼格设计天团',
      action: '更新',
      event: '六月迭代'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 1,
    user: {
      nickname: '@name',
      avatar: '@image(64x64)'
    },
    project: {
      name: '高逼格设计天团',
      action: 'created',
      event: '六月迭代'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 1,
    user: {
      nickname: '曲丽丽',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    },
    project: {
      name: '高逼格设计天团',
      action: 'created',
      event: '六月迭代'
    },
    time: '2018-08-23 14:47:00'
  }
  ])
}

const teams = () => {
  return builder([{
    id: 1,
    name: '科学搬砖组',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
  },
  {
    id: 2,
    name: '程序员日常',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
  },
  {
    id: 1,
    name: '设计天团',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
  },
  {
    id: 1,
    name: '中二少女团',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
  },
  {
    id: 1,
    name: '骗你学计算机',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
  }
  ])
}

const radar = () => {
  return builder([{
    item: '引用',
    '个人': 70,
    '团队': 30,
    '部门': 40
  },
  {
    item: '口碑',
    '个人': 60,
    '团队': 70,
    '部门': 40
  },
  {
    item: '产量',
    '个人': 50,
    '团队': 60,
    '部门': 40
  },
  {
    item: '贡献',
    '个人': 40,
    '团队': 50,
    '部门': 40
  },
  {
    item: '热度',
    '个人': 60,
    '团队': 70,
    '部门': 40
  },
  {
    item: '引用',
    '个人': 70,
    '团队': 50,
    '部门': 40
  }
  ])
}

const cooperData = () => {
  return builder({
    'data': [
      {
        key: '1001',
        id: '1001',
        orderData: '2019-03-22',
        orderNum: 'CGRKD-20181030-041',
        orderStatus: '3',
        paymentStatus: '1',
        wareStatus: '2',
        ticketStatus: '3',
        orderAmount: '19100.00',
        paidBalance: '0.00',
        ticketArrived: '19100.00',
        orderUser: '张三'
      },
      {
        key: '1002',
        id: '1002',
        orderData: '2019-03-23',
        orderNum: 'CGRKD-20181030-041',
        orderStatus: '3',
        paymentStatus: '2',
        wareStatus: '1',
        ticketStatus: '2',
        orderAmount: '19100.00',
        paidBalance: '0.00',
        ticketArrived: '19100.00',
        orderUser: '李四'
      }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  })
}

const hosData = () => {
  return builder({
    'data': [
      {
        id: '1',
        hostName: '第二人民医院',
        hostCode: '1001',
        hostType: '2',
        hostNature: 'CGRKD-20181030-041',
        provinces: '120000',
        city: '120101',
        address: '2',
        region: '3'
      }, {
        id: '2',
        hostName: '第二人民医院q',
        hostCode: '1001',
        hostType: '2',
        hostNature: 'CGRKD-201810w',
        provinces: '120000',
        city: '120101',
        address: '2w',
        region: '3w'
      }],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 5
  })
}

Mock.mock(/\/service/, 'get', serverList)
Mock.mock(/\/list\/search\/projects/, 'get', projects)
Mock.mock(/\/workplace\/activity/, 'get', activity)
Mock.mock(/\/workplace\/teams/, 'get', teams)
Mock.mock(/\/workplace\/radar/, 'get', radar)
Mock.mock(/\/auditData/, 'get', auditData)
Mock.mock(/\/orderData/, 'get', orderData)
Mock.mock(/\/cooperData/, 'get', cooperData)
Mock.mock(/\/hosData/, 'get', hosData)
