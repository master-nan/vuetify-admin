<template lang="pug">
    v-jumbotron(:gradient="gradient" height="100%")
      v-container(fluid fill-height)
        v-layout(align-center justify-center)
          v-flex(xs12 sm8 md4)
            div.pa-3.text-xs-center
              div.display-3.py-4(style="color:#1565C0") {{name}}
            v-card.elevation-12
              v-toolbar(dark color="primary")
                v-toolbar-title {{ 'Login'|i18nName('Login',self) }}
                v-spacer
                v-menu(transition="slide-x-transition" bottom right offset-y)
                  v-btn(icon, dark, slot="activator")
                    v-icon(dark) language
                  v-list
                    v-list-tile(v-for="(lang,i) in langs" :key="i" @click="changeLocale(lang.key)")
                      v-list-tile-title {{lang.value}}
                v-tooltip(bottom)
                  v-btn(icon large :href="link" target="_blank" slot="activator")
                    v-icon(large) mdi-github-circle
                  span Github
              v-card-text
                v-form(ref="form")
                  v-text-field(prepend-icon="person" v-model="form.username" :rules="[v => !!v || 'Username is required']" :label="i18nName('Login','Username')" type="text")
                  v-text-field(prepend-icon="lock" v-model="form.password"  :rules="[v => !!v || 'Password is required']" :label="i18nName('Login','Password')" type="password")
              v-card-actions
                v-spacer
                v-btn(color="primary" @click="submit") {{ 'Submit'|i18nName('Login',self) }}
      Footer(:fixed="fixed")
      MyLoading(ref="loading")
      MyMessage(ref="message")
</template>
<script>
import Footer from '@/views/components/public/Footer'
import api from '@/api'
import store from '@/store'
import util from '@/utils'
import http from '@/utils/http'
export default {
  data () {
    return {
      self: this,
      link: 'https://github.com/master-nan/vuetify-admin',
      gradient: 'to top right, #1A237E, #BBDEFB',
      form: {
        username: null,
        password: null
      },
      valid: false,
      fixed: false,
      langs: [
        { key: 'zh-CN', value: '简体中文' },
        { key: 'en-US', value: 'Englinsh' }
      ],
      name: null
    }
  },
  components: {
    Footer
  },
  methods: {
    i18nName (key = '', title = '') {
      return util.i18nName(key, title, this)
    },
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        let res = await api.base.login(this.form)
        await util.sleep()
        this.$refs.loading.close()
        if (res.code === 200) {
          if (res.data.user['avatar']) {
            res.data.user['avatar'] = http.baseURL + res.data.user['avatar']
          }
          this.$refs.message.open('登录成功', 'success')
          sessionStorage.setItem('menus', JSON.stringify(res.data.menus))
          sessionStorage.setItem('user', JSON.stringify(res.data.user))
          sessionStorage.setItem('token', res.data.token)
          util.toRouter('index', this)
        } else {
          this.$refs.message.open(res.error, 'error')
        }
      }
    },
    changeLocale (e) {
      this.$i18n.locale = e
    },
    async getData () {
      if (store.getters.getSetting.length) {
        this.name = store.getters.getSetting.name
      } else {
        this.loading = true
        let res = await api.base.getSetting()
        util.response(res, this)
        this.loading = false
        if (res.code === 200) {
          this.name = res.data.name
          sessionStorage.setItem('setting', JSON.stringify(res.data))
        }
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
