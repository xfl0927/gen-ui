/**
 * 将接口返回的数组结构的数据转化为树形结构
 */
import Layout from '@/layout'
import * as CryptoJS from 'crypto-js'

/**
 * menud数组对象转路由集合
 * @param array
 * @returns {[]}
 */
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 动态获取组件的方法
export const arrayToMenu = (array) => {
  const nodes = []
  // 获取顶级节点
  for (let i = 0; i < array.length; i++) {
    const row = array[i]
    if (!exists(array, row.parentId)) {
      nodes.push({
        path: row.path,
        component: Layout,
        name: row.code,
        meta: { title: row.name, icon: row.icon },
        id: row.id
      })
    }
  }
  const toDo = Array.from(nodes)
  while (toDo.length) {
    const node = toDo.shift()
    // 获取子节点
    for (let i = 0; i < array.length; i++) {
      const row = array[i]
      if (row.parentId === node.id) {
        const child = {
          path: row.path,
          name: row.code,
          component: _import(row.component),
          meta: { title: row.name, icon: row.icon },
          id: row.id
        }
        if (node.children) {
          node.children.push(child)
        } else {
          node.children = [child]
          if (!node.parentId) {
            node.redirect = node.path + '/' + row.path
          }
        }
        toDo.push(child)
      }
    }
  }
  return nodes
}

/**
 * 将接口返回的数组结构的数据转化为树型结构
 */
export const arrayToTree = (array, targetField) => {
  const nodes = []
  // 获取顶级节点`
  for (let i = 0; i < array.length; i++) {
    const row = array[i]
    if (!exists(array, row.parentId)) {
      nodes.push({
        label: row[targetField],
        id: row.id
      })
    }
  }
  const toDo = Array.from(nodes)
  while (toDo.length) {
    const node = toDo.shift()
    // 获取子节点
    for (let i = 0; i < array.length; i++) {
      const row = array[i]
      if (row.parentId === node.id) {
        const child = {
          label: row[targetField],
          id: row.id
        }
        if (node.children) {
          node.children.push(child)
        } else {
          node.children = [child]
        }
        toDo.push(child)
      }
    }
  }
  return nodes
}

const exists = (rows, parentId) => {
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].id === parentId) return true
  }
  return false
}

/**
 * 将数组结构数据按照指定字段转化成对象结构
 */
export const arrayToMap = (arr, targetField) => {
  const map = {}
  const t = targetField
  if (arr instanceof Array) {
    arr.forEach(function(item) {
      if (!map[item[t]]) {
        map[item[t]] = []
      }
    })
    for (const p in map) {
      arr.forEach(function(item) {
        if (p === item[t]) {
          map[p].push(item)
        }
      })
    }
  }
  return map
}

/**
 * 将数组结构数据按照指定字段转化成对象结构
 */
export const arrayToMapField = (arr, targetField, itemField) => {
  const map = {}
  const t = targetField
  if (arr instanceof Array) {
    arr.forEach(function(item) {
      if (!map[item[t]]) {
        map[item[t]] = ''
      }
    })
    for (const p in map) {
      arr.forEach(function(item) {
        if (p === item[t]) {
          map[p] = item[itemField]
        }
      })
    }
  }
  return map
}
// 定义一个深拷贝函数  接收目标target参数
export const deepClone = (target) => {
  // 定义一个变量
  let result
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {}
      for (const i in target) {
        result[i] = deepClone(target[i])
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target
  }
  // 返回最终结果
  return result
}
/**
 * 打开窗口
 * @param {Sting} url
 * @param {Sting} title
 * @param {Number} w
 * @param {Number} h
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}
/**
 *加密处理
 */
export const encryption = (params) => {
  // eslint-disable-next-line prefer-const
  let { data, type, param, key } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      // 加密
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len || 4)
  if (date) random = random + Date.now()
  return random
}
/**
 * 表单序列化
 * @param data
 * @returns {string}
 */
export const serialize = data => {
  const list = []
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}

/**
 * 查询对象转查询字符串
 * @param obj
 */
export const queryToString = (obj) => {
  const qs = []
  if (obj instanceof Object) {
    for (const key in obj) {
      if (obj[key]) {
        qs.push(key + '=' + obj[key])
      }
    }
  }
  return qs.join(';')
}

/**
 * 模板渲染公共方法
 * @param template 字符串模板
 * @param obj 数据对象
 * @returns {*}
 */
export const renderTemplate = (template, obj) => {
  if (!obj) {
    return template
  } else if (obj instanceof Array) {
    const toReplace = template.match(new RegExp('\\{{[^\}]+\\}}', 'g'))
    toReplace.forEach((val, index) => {
      template = template.replace(val, obj[index])
    })
  } else if (obj instanceof Object) {
    for (const key in obj) {
      const val = obj[key]
      if (!(val instanceof Object || val instanceof Array || val instanceof Function)) {
        template = template.replace(new RegExp('\\{{\\s*' + key + '\\s*\\}}', 'g'), val)
      }
    }
  }
  return template
}

/**
 * 计算表格总体高度
 * @param tableEl
 * @returns {number}
 */
export const calcTableHeight = (object) => {
  const tableEl = object.$refs.table.$el
  const section = tableEl.closest('section')
  const container = section.firstChild
  const pagination = container.querySelector('.pagination-container')
  object.tableHeight = getTableHeight(section, container, tableEl, pagination)
  window.onresize = () => {
    return (() => {
      object.tableHeight = getTableHeight(section, container, tableEl, pagination)
    })()
  }
}

const getTableHeight = (section, container, tableEl, pagination) => {
  const containerPb = parseInt(getStyle(container, 'padding-bottom')) || 15
  let paginationHeight = 0
  if (pagination) {
    const paginationMarginTop = parseInt(getStyle(pagination, 'marginTop'))
    paginationHeight = pagination.clientHeight + paginationMarginTop
  }
  return window.innerHeight - section.offsetTop - tableEl.offsetTop - paginationHeight - containerPb
}

// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
export const getStyle = (function() {
  if (window.document.currentStyle) {
    return (dom, attr) => dom.currentStyle[attr]
  } else {
    return (dom, attr) => getComputedStyle(dom, false)[attr]
  }
})()

/**
 * 获取表格操作实时位置样式
 * @param event
 * @param tableEl
 * @returns {{top: *, right: *}}
 */
export function getTableOptStyle(event, tableEl) {
  let target = event.target
  if (target.tagName !== 'TR') {
    target = target.closest('TR')
  }
  let dom = target
  let iTop = -50
  let iLeft = 0

  do {
    iTop += dom.offsetTop // 如果是左侧就是offsetLeft
    iLeft += dom.offsetLeft
    dom = dom.parentNode // 如果存在父节点，父节点为当前节点计算
  } while (dom.parentNode)

  const bodyWrapper = target.closest('.el-table__body-wrapper')
  const tableWidth = bodyWrapper ? bodyWrapper.clientWidth : 0
  const trWidth = target.clientWidth
  const right = window.innerWidth - iLeft - Math.min(tableWidth, trWidth)
  const height = target.clientHeight
  return 'top:' + iTop + 'px;right:' + right + 'px;height:' + height + 'px'
}

/**
 * 计算表格总体高度
 * @param obj
 *   dom: 当前元素距离视口绝对高度
 *   pagination： 分页容器高度
 *   marginTop:分页容器marginTop
 *   otherNumber: 其他高度值之和
 *
 * @returns {number}
 */
export const getOffsetTop = (obj) => {
  const self = obj.self
  let pagination = null
  if (self.$refs['el-pagination']) {
    pagination = self.$refs['el-pagination'].$el
    pagination.style.display = 'block'
  }
  const clientHeight = document.documentElement.clientHeight
  const marginTop = obj.marginTop || 5
  const otherNumber = obj.otherNumber || 0
  const otherHeightSum = pagination ? pagination.clientHeight + otherNumber : marginTop + otherNumber
  if (!self.$refs['el-table']) {
    return 0
  }
  let table = self.$refs['el-table'].$el
  let iTop = table.offsetTop
  while (table.offsetParent) {
    table = table.offsetParent
    iTop += table.offsetTop
  }
  const height = clientHeight - (iTop + otherHeightSum)
  return height
}

/**
 * array转为元素以 ',' 分隔的字符串
 */
export function getArrayToStrByComma(ary) {
  if (ary != null) {
    let str = ''
    // 循环数组
    for (let i = 0; i < ary.length; i++) {
      if (i === 0) {
        str += ary[i]
      } else {
        str += ',' + ary[i]
      }
    }
    return str
  }
  return null
}

/**
 * 字符串转为数组以 ',' 为 数组分隔的元素
 */
export function getStrToArrayByComma(str) {
  if (str != null && str != '') {
    let array = []
    array = str.split(',')
    return array
  }
  return []
}
