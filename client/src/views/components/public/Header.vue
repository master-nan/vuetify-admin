<template lang="pug">
  v-toolbar.primary(app :clipped-left="clipped" dark)
    v-toolbar-side-icon(@click.stop="setDrawer")
    //- <v-btn icon @click.stop="setMiniVariant">
    //-   <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
    //- </v-btn>
    //- <v-btn icon @click.stop="setClipped">
    //-   <v-icon>web</v-icon>
    //- </v-btn>
    v-toolbar-title System
    v-breadcrumbs.bcb(divider="/")
      v-breadcrumbs-item(v-for="(item,index) in items" :key="item.text" :disabled='item.redirect===""||index==items.length-1')
        span(v-if='item.redirect===""||index==items.length-1') {{item.meta.title|i18nName('Menu',self)}}
        router-link(v-else :to="item.redirect||item.path") {{item.meta.title|i18nName('Menu',self)}}
    v-spacer
    v-menu(transition="slide-x-transition" bottom right offset-y)
      v-btn(icon, dark, slot="activator")
        v-icon(dark) language
      v-list
        v-list-tile(v-for="(lang,i) in langs" :key="i" @click="changeLocale(lang.key)")
          v-list-tile-title {{lang.value}}
    v-avatar(size="38px" color="green lighten-4")
      img(src="@/assets/image/avatar.jpg" alt="avatar")
    v-menu(transition="slide-x-transition" bottom right offset-y)
      v-btn(slot="activator" icon)
        v-icon more_vert
      v-list
        v-list-tile(@click="handleCommand('info')")
          v-list-tile-title 个人信息
        v-list-tile(@click="handleCommand('password')")
          v-list-tile-title 修改密码
        v-list-tile(@click="handleCommand('logout')")
          v-list-tile-title 退出
</template>
<script>
import api from '@/api'
import util from '@/utils'
export default {
  name: 'top',
  data () {
    return {
      self: this,
      items: null,
      langs: [
        { key: 'zh-CN', value: '简体中文' },
        { key: 'en-US', value: 'Englinsh' }
      ]
    }
  },
  props: ['clipped', 'miniVariant', 'drawer'],
  methods: {
    setDrawer () {
      this.$emit('setDrawer', !this.drawer)
    },
    setMiniVariant () {
      this.$emit('setMiniVariant', !this.miniVariant)
    },
    setClipped () {
      this.$emit('setClipped', !this.clipped)
    },
    async handleCommand (e) {
      switch (e) {
        case 'logout':
          let res = await api.comm.logout()
          util.response(res, this)
          if (res.code === 200) {
            util.message('您已退出')
            await util.sleep(300)
            util.clearSome(this)
          }
          util.clearSome(this)
          break
        case 'change':
          // this.dialogFormVisible = true
          break
        case 'info':
          util.toRouter('info', this)
          break
        default:
          console.log(e)
      }
    },
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'index') {
        matched = [{ path: '/index', meta: { title: 'Home' } }].concat(matched)
      }
      this.items = matched
    },
    changeLocale (e) {
      this.$i18n.locale = e
    }
  },
  created () {
    this.getBreadcrumb()
  },
  watch: {
    '$route' () {
      this.getBreadcrumb()
    }
  }
}
</script>
<style lang="less" scoped>
.bcb {
  &>li {
    a.v-breadcrumbs__item a{
      color: #EEEEEE !important;
      font-weight: 400;
    }
    a.v-breadcrumbs__item--disabled a{
      color: #BDBDBD !important;
      font-weight: 300;
    }
  }
}
</style>
