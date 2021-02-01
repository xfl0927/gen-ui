import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const settings = {
  state: {
    theme: variables.theme,
    showSettings: showSettings,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  },
  mutations: {
    CHANGE_SETTING: (state, { key, value }) => {
      if (state.hasOwnProperty(key)) {
        state[key] = value
      }
    }
  },
  actions: {
    ChangeSetting({ commit }, data) {
      commit('CHANGE_SETTING', data)
    }
  }
}

export default settings

