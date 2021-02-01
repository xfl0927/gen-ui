import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'medium',
    aside: {
      opened: false,
      withoutAnimation: true
    },
    showChangePassword: false,
    showLoading: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    TOGGLE_ASIDE: state => {
      state.aside.opened = !state.aside.opened
      state.aside.withoutAnimation = true
    },
    CLOSE_ASIDE: (state, withoutAnimation) => {
      state.aside.opened = false
      state.aside.withoutAnimation = withoutAnimation
    },
    TOGGLE_PASSWORD: (state, isShow) => {
      state.showChangePassword = isShow
    },
    TOGGLE_LOADING: (state, isShow) => {
      state.showLoading = isShow
    }
  },
  actions: {
    ToggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    SetSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    ToggleASide: ({ commit }) => {
      commit('TOGGLE_ASIDE')
    },
    CloseASide({ commit }, { withoutAnimation }) {
      commit('CLOSE_ASIDE', withoutAnimation)
    },
    ToggleShowPassword({ commit }, isShow) {
      commit('TOGGLE_PASSWORD', isShow)
    },
    ToggleShowLoading({ commit }, isShow) {
      commit('TOGGLE_LOADING', isShow)
    }
  }
}

export default app
