<template lang="pug">
    v-jumbotron(:gradient="gradient" height="100%")
      v-container(fluid fill-height)
        v-layout(align-center justify-center)
          v-flex(xs12 sm8 md4)
            div.pa-3.text-xs-center
              div.display-3.py-4(style="color:#1565C0") Walnutech
            v-card.elevation-12
              v-toolbar(dark color="primary")
                v-toolbar-title Login
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
                  v-text-field(prepend-icon="person" v-model="from.username" :rules="[v => !!v || 'Username is required']" label="Username" type="text")
                  v-text-field(prepend-icon="lock" v-model="from.password"  :rules="[v => !!v || 'Password is required']" label="Password" type="password")
              v-card-actions
                v-spacer
                v-btn(color="primary" @click="submit") Login
      Footer(:fixed="fixed")
      MyLoading(ref="loading")
      MyMessage(ref="message")
</template>
<script>
import Footer from '@/views/components/public/Footer'
import util from '@/utils'
export default {
  data () {
    return {
      self: this,
      link: 'https://github.com/master-nan/my-vuetify',
      gradient: 'to top right, #1A237E, #BBDEFB',
      from: {
        username: null,
        password: null
      },
      valid: false,
      fixed: false,
      langs: [
        { key: 'zh-CN', value: '简体中文' },
        { key: 'en-US', value: 'Englinsh' }
      ]
    }
  },
  components: {
    Footer
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        await util.sleep()
        this.$refs.loading.close()
        this.$refs.message.open('登录成功', 'success')
        await util.sleep()
        sessionStorage.setItem('token', 1)
        this.$router.push('/index')
      }
    },
    changeLocale (e) {
      this.$i18n.locale = e
    }
  }
}
</script>
