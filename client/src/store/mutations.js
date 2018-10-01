import { currentRouter } from '@/router'
const mutations = {
  setPrivateRouter (state, data) {
    if (data && data.length) {
      state.privateRouter = currentRouter.concat(data)
    } else {
      state.privateRouter = []
    }
  },
  setUserInfo (state, data) {
    if (data) {
      state.userInfo = data
    } else {
      state.userInfo = []
    }
  },
  setSetting (state, data) {
    if (data) {
      state.setting = data
    } else {
      state.setting = []
    }
  }
}
export default mutations
