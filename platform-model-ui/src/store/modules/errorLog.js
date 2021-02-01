const errorLog = {
  state: {
    logs: []
  },
  mutations: {
    ADD_ERROR_LOG: (state, log) => {
      state.logs.push(log)
    },
    CLEAR_ERROR_LOG: (state) => {
      state.logs.splice(0)
    }
  },
  actions: {
    AddErrorLog({ commit }, log) {
      commit('ADD_ERROR_LOG', log)
    },
    ClearErrorLog({ commit }) {
      commit('CLEAR_ERROR_LOG')
    }
  }
}

export default errorLog
