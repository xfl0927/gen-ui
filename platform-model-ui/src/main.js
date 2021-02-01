import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import CommonPlugin from './utils/common-plugin'

import '@/styles/index.scss' // global css
import * as filters from './filters' // global filters


import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'development') {
  mockXHR()
}

import AFTableColumn from 'af-table-column'
Vue.use(AFTableColumn)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
Vue.use(ElementUI, { locale, size: 'mini' })
Vue.use(CommonPlugin)
// 如果想要中文版 element-ui，按如下方式声明

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
