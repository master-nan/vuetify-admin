import _ from 'lodash'
import http from '@/utils/http'
import comps from './components'
import moment from 'moment'

let response = async (res, vm) => {
  if (res.code === 101) {
    await sleep()
    clearSome(vm)
    return false
  } else if (res.code === 401) {
    await sleep()
    vm.$router.push('/401')
    return false
  }
}

let clearSome = (vm) => {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('setting')
  sessionStorage.removeItem('menus')
  sessionStorage.removeItem('user')
  vm.$store.dispatch('setPrivateRouter', null)
  vm.$store.dispatch('setUserInfo', null)
  vm.$router.push('/login')
}

let sleep = (d = 800) => {
  return new Promise((resolve) => {
    setTimeout(resolve, d)
  })
}

let toRouter = (name, vm, data = {}, type = 'params') => {
  if (!name) name = vm.$route.name
  if (name === vm.$route.name) {
    vm.$router.push({name: 'refresh', query: { name: name }})
  } else {
    if (type === 'params') {
      vm.$router.push({name: name, params: data})
    } else {
      vm.$router.push({name: name, query: data})
    }
  }
}

let setMenus = () => {
  let data = sessionStorage.getItem('menus')
  let d = []
  if (data) {
    d = setComponent(JSON.parse(data))
  }
  return d
}

let setComponent = (data = {}) => {
  _.forEach(data, function (v, k) {
    v.meta = {
      title: v.title,
      icon: v.icon
    }
    if (v.name && comps[v.name]) {
      v.component = comps[v.name]
    } else {
      v.component = comps['home']
    }
    if (v.children && v.children.length) v.children = setComponent(v.children)
  })
  return data
}

let setUser = (data, vm) => {
  let user = JSON.parse(sessionStorage.getItem('user'))
  _.forEach(data, function (v, k) {
    if (v) {
      if (k === 'avatar') {
        user[k] = http.baseURL + v
      } else {
        user[k] = v
      }
    }
  })
  sessionStorage.setItem('user', JSON.stringify(user))
  vm.$store.dispatch('setUserInfo', user)
}

// 全局过滤中也有相同方法，看方便
let i18nName = (key = null, title = null, vm) => {
  let name = key + '.' + title
  if (vm.$te(name)) {
    return vm.$t(name)
  }
  return title
}

let returnName = (key, data = {}) => {
  let name = ''
  _.forEach(data, function (v, k) {
    if (v.id === key) {
      name = v.name
    }
  })
  return name
}

// 深拷贝
let cloneDeep = (val) => {
  return _.cloneDeep(val)
  // return Object.assign({}, val)
}
let timeFilter = (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!value) return ''
  let day = moment.unix(value)
  let date = moment(day).format(format)
  return date
}

export default {
  response,
  sleep,
  toRouter,
  clearSome,
  setMenus,
  setUser,
  i18nName,
  cloneDeep,
  returnName,
  timeFilter
}
