import Mock from 'mockjs2'
import { builder } from '../util'
import { bxAnaalyse, homeIcon, auditIcon, orderIcon, productIcon, storage, userIcon, saleIcon, logistics, setIcon } from '@/core/icons'

const info = (options) => {
  // console.log('options', options)
  const userInfo = {
    'id': '4291d7da9005377ec9aec4a71ea837f',
    'name': '天野远子',
    'username': 'admin',
    'password': '',
    'avatar': '/avatar2.jpg',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'merchantCode': 'TLif2btpzg079h15bk',
    'deleted': 0,
    'roleId': 'admin',
    'role': {}
  }
  // role
  const roleObj = {
    'id': 'admin',
    'name': '管理员',
    'describe': '拥有所有权限',
    'status': 1,
    'creatorId': 'system',
    'createTime': 1497160610259,
    'deleted': 0,
    'permissions': [{
      'roleId': 'admin',
      'permissionId': 'auditManage',
      'permissionName': '仪表盘',
      'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }, {
        'action': 'query',
        'describe': '查询',
        'defaultCheck': false
      }, {
        'action': 'get',
        'describe': '详情',
        'defaultCheck': false
      }, {
        'action': 'update',
        'describe': '修改',
        'defaultCheck': false
      }, {
        'action': 'delete',
        'describe': '删除',
        'defaultCheck': false
      }],
      'actionList': null,
      'dataAccess': null
    }, {
      'roleId': 'admin',
      'permissionId': 'exception',
      'permissionName': '异常页面权限',
      'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
      'actionEntitySet': [{
        'action': 'add',
        'describe': '新增',
        'defaultCheck': false
      }, {
        'action': 'query',
        'describe': '查询',
        'defaultCheck': false
      }, {
        'action': 'get',
        'describe': '详情',
        'defaultCheck': false
      }, {
        'action': 'update',
        'describe': '修改',
        'defaultCheck': false
      }, {
        'action': 'delete',
        'describe': '删除',
        'defaultCheck': false
      }],
      'actionList': null,
      'dataAccess': null
    }]
  }

  // roleObj.permissions.push({
  //   'roleId': 'admin',
  //   'permissionId': 'support',
  //   'permissionName': '超级模块',
  //   'actions': '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
  //   'actionEntitySet': [{
  //     'action': 'add',
  //     'describe': '新增',
  //     'defaultCheck': false
  //   }, {
  //     'action': 'import',
  //     'describe': '导入',
  //     'defaultCheck': false
  //   }, {
  //     'action': 'get',
  //     'describe': '详情',
  //     'defaultCheck': false
  //   }, {
  //     'action': 'update',
  //     'describe': '修改',
  //     'defaultCheck': false
  //   }, {
  //     'action': 'delete',
  //     'describe': '删除',
  //     'defaultCheck': false
  //   }, {
  //     'action': 'export',
  //     'describe': '导出',
  //     'defaultCheck': false
  //   }],
  //   'actionList': null,
  //   'dataAccess': null
  // })

  userInfo.role = roleObj
  return builder(userInfo)
}

const getLeftTree = () => {
  return builder(
    [{
      'title': 'ERP',
      'key': '',
      'name': 'index',
      'component': 'BasicLayout',
      'redirect': '/home',
      'children': [
        {
          'title': '首页',
          'key': 'home',
          'component': 'RouteView',
          'icon': 'homeIcon',
          'children': [
            {
              'title': '首页',
              'key': 'work',
              'component': 'RouteView',
              'icon': '',
              'children': [
                {
                  'title': '工作台',
                  'key': 'workbench',
                  'icon': '',
                }
              ]
            },
          ]
        },
        {
          'title': '设置',
          'key': 'settings',
          'component': 'RouteView',
          'icon': 'setIcon',
          'children': [
            {
              'title': '信息管理',
              'key': 'information',
              'component': 'RouteView',
              'children': [
                {
                  'title': '厂商管理',
                  'key': 'Information',
                  'icon': '',
                },
                {
                  'title': '合作商管理',
                  'key': 'Cooperator',
                  'icon': '',
                },
                {
                  'title': '我的供货商',
                  'key': 'Supplier',
                  'icon': '',
                },
                {
                  'title': '我的客户',
                  'key': 'MyUsers',
                  'icon': '',
                }
              ]
            },
            {
              'title': '权限管理',
              'key': 'permission',
              'component': 'RouteView',
              'children': [
                {
                  'title': '用户管理',
                  'key': 'PurviewUser',
                  'icon': '',
                },
                {
                  'title': '角色管理',
                  'key': 'roleManage',
                  'icon': '',
                },
                {
                  'title': '菜单设计',
                  'key': 'menuDesign',
                  'icon': '',
                }
              ]
            }
          ]
        }
      ]
    }]
  )
}

Mock.mock(/\/erp\/user\/info/, 'get', info)
Mock.mock(/\/user\/getLeftTree/, 'get', getLeftTree)
