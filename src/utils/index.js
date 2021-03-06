import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

// 验证是否整数,非必填
export function isIntegerNotMust (rule, value, callback) {
  if (!value) {
    callback()
  }
  setTimeout(() => {
    const re = /^[+]{0,1}(\d+)$/
    const rsCheck = re.test(value)
    if (!rsCheck) {
      callback(new Error('请输入正整数'))
    } else {
      callback()
    }
  }, 1000)
}

// 验证是否1-99之间
export function isOneToNinetyNine (rule, value, callback) {
  if (!value) {
    return callback(new Error('输入不可以为空'))
  }
  setTimeout(() => {
    const re = /^[+]{0,1}(\d+)$/
    const rsCheck = re.test(value)
    if (!rsCheck) {
      callback(new Error('请输入正整数'))
    } else {
      callback()
    }
  }, 0)
}
