/* eslint-disable import/no-duplicates */
/* eslint-disable quotes */
/* eslint-disable handle-callback-err */
import Vue from 'vue'
import axios from 'axios'
import notification from "ant-design-vue/es/notification"
import { ACCESS_TOKEN, PRODUCT_PARAMS, ACCESS_MENU } from '@/store/mutation-types'
/**
 * Set storage
 *
 * @param name
 * @param content
 * @param maxAge
 */
export const setStore = (name, content, maxAge = null) => {
  if (!global.window || !name) {
    return
  }

  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }

  const storage = global.window.localStorage

  storage.setItem(name, content)
  if (maxAge && !isNaN(parseInt(maxAge))) {
    const timeout = parseInt(new Date().getTime() / 1000)
    storage.setItem(`${name}_expire`, timeout + maxAge)
  }
}

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
export const getStore = name => {
  if (!global.window || !name) {
    return
  }

  const content = window.localStorage.getItem(name)
  const _expire = window.localStorage.getItem(`${name}_expire`)

  if (_expire) {
    const now = parseInt(new Date().getTime() / 1000)
    if (now > _expire) {
      return
    }
  }

  try {
    return JSON.parse(content)
  } catch (e) {
    return content
  }
}

/**
 * Clear storage
 *
 * @param name
 */
export const clearStore = name => {
  if (!global.window || !name) {
    return
  }

  window.localStorage.removeItem(name)
  window.localStorage.removeItem(`${name}_expire`)
}

/**
 * Clear all storage
 */
export const clearAll = () => {
  if (!global.window || !name) {
    return
  }

  window.localStorage.clear()
}

// data filter
export const DataFilter = (res, listKye) => {
  const storageList = res.data
  const storageData = {
    'data': storageList.list ? storageList.list.map((item, index) => {
      return {
        key: listKye + index,
        ...item
      }
    }) : storageList.map((item, index) => {
      return {
        key: listKye + index,
        ...item
      }
    }),
    'pageSize': res.data.pageSize,
    'pageNo': res.data.pageNum,
    'totalCount': res.data.total,
    'totalPage': res.data.pages
  }
  return storageData
}

// 按钮判断
export const BtnShow = (pageName) => {
  // console.info('pageName---',pageName)
  const showList = []
  const menuTree = Vue.ls.get(ACCESS_MENU)
  // console.info('menuTree---',menuTree)
  menuTree.children.map(item => {
    item.children.map(second => {
      second.children.map(third => {
        if (third.menuUrl === pageName) {
          // console.info('four---',third)
          third.children.map(btn => {
            if (showList.indexOf(btn.menuUrl) === -1) {
              showList.push(btn.menuUrl)
            }
          })
        }
      })
    })
  })
  // console.info(showList)
  return showList
}

// 导出前判断
export const exportTabList = (tableList) => {
  if (tableList.data && tableList.data.length === 0) {
    notification.info({
      message: '提示',
      description: '暂无数据，无法导出！',
      duration: 4
    })
  } else if (!tableList.data) {
    notification.info({
      message: '提示',
      description: '数据加载中，请稍后！',
      duration: 4
    })
  } else {
    return true
  }
}
// 导出表格
// tableList：表格中的数据
// params：传入后端接口的参数
// api：后端接口的地址
// tableTitle：导出文件的名字
export const exportTable = (tableList, params, api, tableTitle, exportType) => {
  // console.info('exportType==', tableList)
  if (!exportType) {
    notification.info({
      message: '提示',
      description: '默认导出近三个月数据，可以通过修改查询日期修改导出数据！',
      duration: 4
    })
  }

  if ((tableList.length > 0 && !exportType) || exportType) {
    notification.success({
      message: '成功',
      description: '正在导出列表，请稍等',
      duration: 1
    })
    return axios({
      method: 'post',
      url: api,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
      },
      responseType: 'arraybuffer',
      data: params // data是添加到请求体（body）中的， 用于post请求。
    }).then(res => {
      if (res.status === 200) {
        const link = document.createElement('a')
        const blob = new Blob([res.data], {
          type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        link.style.display = 'none'
        link.href = window.URL.createObjectURL(blob)
        link.download = tableTitle + '.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        notification.success({
          message: '成功',
          description: '导出成功',
          duration: 3
        })
      }
    }).catch(error => {
      notification.error({
        message: '失败',
        description: '导出失败',
        duration: 3
      })
    })
  }
  notification.error({
    message: '失败',
    description: '表格中没有数据无法导出',
    duration: 3
  })

  return false
}

// 保存出入库详情或编辑页面params
export const saveParamsFromStore = (params, storageName) => {
  // console.info('PRODUCT_PARAMS---', params, storageName)
  if (params === null) {
    Vue.ls.set('PRODUCT_' + storageName, {})
  } else {
    Vue.ls.set('PRODUCT_' + storageName, params)
  }
}

// 刷新页面获取params
export const getParamsFromStore = (storageName) => {
  // console.info('PRODUCT_PARAMS---', storageName)
  return Vue.ls.get('PRODUCT_' + storageName)
}
