import store from '../index'
import { MessageBox } from 'element-ui'
import { arrayToMenu } from '@/utils/public'
import { constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    applications: [],
    appRoutes: {},
    routes: [],
    addRoutes: [],
    isAddRoute: false,
    homePageUrl: ''
  },
  mutations: {
    SET_HOME_PAGE: (state, homePageUrl) => {
      state.homePageUrl = homePageUrl
    },
    SET_APPS: (state, applications) => {
      state.applications = applications
    },
    SET_APP_ROUTES: (state, appRoutes) => {
      state.appRoutes = appRoutes
    },
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_ISADDROUTE: (state, isAddRoute) => {
      state.isAddRoute = isAddRoute
    },
    SET_APPLICATIONS: (state, applications) => {
      state.applications = applications
    },
    SET_APP_ROUTERS: (state, appRoutes) => {
      state.appRouters = appRoutes
    }
  },
  actions: {
    SetHomePage({ commit }, homePageUrl) {
      commit('SET_HOME_PAGE', homePageUrl)
    },
    GetRouterList({ commit }, routers) {
      commit('SET_ROUTES', routers)
    },
    generateRoutes({ commit }, roles) {
      return new Promise((resolve, reject) => {
        getPermission().then(res => {
          const accessedRoutes = arrayToMenu(res.data)
          if (accessedRoutes && accessedRoutes.length) {
            accessedRoutes.concat([{ pafth: '*', redirect: '/404', hidden: true }])
            commit('SET_ROUTES', accessedRoutes)
            resolve()
          } else {
            MessageBox.alert('你没有访问系统的权限，请联系管理员！', '无权限', {
              confirmButtonText: '确定', callback: action => {
                store.dispatch('FedLogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              }
            })
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    IsAddRouteFalse({ commit }) {
      return new Promise(resolve => {
        commit('SET_ISADDROUTE', false)
        resolve()
      })
    },
    ToggleIsAddRoute({ commit }) {
      return new Promise(resolve => {
        commit('SET_ISADDROUTE', true)
        resolve()
      })
    }
  }
}

export default permission
