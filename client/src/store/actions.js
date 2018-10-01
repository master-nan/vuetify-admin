const actions = {
  setPrivateRouter ({commit}, data) {
    return new Promise(resolve => {
      commit('setPrivateRouter', data)
      resolve()
    })
  },
  setUserInfo ({commit}, data) {
    return new Promise(resolve => {
      commit('setUserInfo', data)
      resolve()
    })
  },
  setSetting ({commit}, data) {
    return new Promise(resolve => {
      commit('setSetting', data)
      resolve()
    })
  }
}

export default actions
