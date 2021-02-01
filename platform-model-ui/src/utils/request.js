import axios from 'axios'
import { Message, MessageBox, Loading  } from 'element-ui'
import store from '@/store'
import { serialize, randomLenNum } from '@/utils/public'
import { getAccessToken } from '@/utils/auth'

let loading = null
let loadingAccount = 0
let timer = null

function laodingFn() {
  if (loadingAccount <= 0) {
    loading = Loading.service({
      lock: true,
      text: ' ',
      background: 'rgba(0, 0, 0, 0)',
      customClass: 'global-loading-style'
    })
  }
  loadingAccount++
}

function clseLoadingFn() {
  if (timer) {
    clearTimeout(timer)
  }

  if (loadingAccount > 0) {
    loadingAccount--
  }

  if (loadingAccount === 0) {
    // timer = setTimeout(() => {
      loading.close()
    // }, 500)
  }
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API.replace(new RegExp('/+', 'gm'), '/'), // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 600000 // request timeout
})

const toLogins = ['401', '90001', '90002', '90003', '90004', '90005', '90006']
// request interceptor
service.interceptors.request.use(
  config => {

    if (config.url.indexOf('/checkNotExists') === -1) {
    // 忽略判断重复接口
        laodingFn()
    }

    config.url = config.url.replace(new RegExp('/+', 'gm'), '/')
    // do something before request is sents
    config.headers['request-id'] = randomLenNum(6, true)
    // 让每个请求携带自定义token 请根据实际情况自行修改
    if (getAccessToken()) {
      config.headers['Authorization'] = 'Bearer ' + getAccessToken()
    }

    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && config.headers.serialize) {
      config.data = serialize(config.data)
      delete config.data.serialize
    }
    return config
  },
  error => {
    clseLoadingFn()
    // 关闭加载框
    store.dispatch('ToggleShowLoading', false).then()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    /**
     * code为非000000是抛错 可结合自己业务进行修改
     */
    store.dispatch('ToggleShowLoading', false).then()
    const res = response.data
    if (!res.code) {
      clseLoadingFn()
      return res
    }

    if (res.code === '000000' || res.code === '222222') {
      clseLoadingFn()
      return res
    } else if (toLogins.includes(res.code)) {
      MessageBox.alert(res.message, '登录异常', {
        confirmButtonText: '重新登录', callback: action => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()
          })
        }
      })
    } else {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      clseLoadingFn()
      return Promise.reject(res.message)
    }
  },
  error => {
    store.dispatch('ToggleShowLoading', false).then()
    const status = Number(error.response.status)
    if (status === 401) {
      store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
      clseLoadingFn()
    } else {
      Message({
        message: '请求失败',
        type: 'error',
        duration: 5 * 1000
      })
      clseLoadingFn()
      return Promise.reject(error)
    }
  }
)

export default service
