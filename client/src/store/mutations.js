import { currentRouter } from '@/router'
const mutations = {
  setPrivateRouter (state, data) {
    console.log(2)
    if (data && data.length) {
      state.privateRouter = currentRouter.concat(data)
    } else {
      state.privateRouter = currentRouter
    }
  },
  setUserInfo (state, data) {
    if (data) {
      state.userInfo = data
    } else {
      state.userInfo = []
    }
  }
}
export default mutations
