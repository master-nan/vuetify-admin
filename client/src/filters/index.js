// 全局过滤
import Vue from 'vue'
import moment from 'moment'

Vue.filter('timeFilter', function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!value) return ''
  let day = moment.unix(value)
  let date = moment(day).format(format)
  return date
})

// uitl中也有相同方法，看方便
Vue.filter('i18nName', function (title = '', key = '', vm = null) {
  let name = key + '.' + title
  if (vm.$te(name)) {
    return vm.$t(name)
  }
  return title
})

Vue.filter('statusFilter', function (val, type = 1) {
  let title = 'Enabled'
  switch (type) {
    case 1:
      if (val === 1) {
        title = 'Enabled'
      } else {
        title = 'Disabled'
      }
      break
    case 2:
      if (val === 1) {
        title = 'Show'
      } else {
        title = 'Hidden'
      }
      break
    case 3:
      if (val === 1) {
        title = 'Hidden'
      } else {
        title = 'Show'
      }
      break
    default:
  }
  return title
})

Vue.filter('statusChipFilter', function (val, type = 1) {
  let title = 'success'
  switch (type) {
    case 1:
      if (val === 1) {
        title = 'success'
      } else {
        title = 'error'
      }
      break
    case 2:
      if (val === 1) {
        title = 'deep-purple'
      } else {
        title = 'warning'
      }
      break
    case 3:
      if (val === 1) {
        title = 'info'
      } else {
        title = 'orange'
      }
      break
    default:
  }
  return title
})
