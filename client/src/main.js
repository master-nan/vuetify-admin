import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueI18n from 'vue-i18n'
import zh from './lang/zh-CN'
import en from './lang/en-US'

import './filters'

import 'babel-polyfill'
import '@mdi/font/css/materialdesignicons.min.css'

import '@fortawesome/fontawesome-free/css/all.min.css'

import { Tree, Button } from 'element-ui'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import './assets/style/index.less'

import MyLoading from '@/views/components/public/Loading.vue'
import MyMessage from '@/views/components/public/Message.vue'
import MyComfirm from '@/views/components/public/Comfirm.vue'

Vue.use(Tree)
Vue.use(Button)

Vue.use(VueI18n)

Vue.component('MyLoading', MyLoading)
Vue.component('MyMessage', MyMessage)
Vue.component('MyComfirm', MyComfirm)

const messages = {
  'en-US': {
    ...en
  },
  'zh-CN': {
    ...zh
  }
}

const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  messages // set locale messages
})

Vue.use(Vuetify, {
  iconfont: 'md' // 'md' || 'mdi' || 'fa' || 'fa4'
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
