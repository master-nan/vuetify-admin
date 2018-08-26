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
  let title = 'Enable'
  switch (type) {
    case 1:
      if (val === 1) {
        title = 'Enable'
      } else {
        title = 'Disable'
      }
      break
    default:
  }
  return title
})
