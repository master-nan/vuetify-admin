<template lang="pug">
  v-content
    v-navigation-drawer(:mini-variant="miniVariant" :clipped="clipped" v-model="drawer" fixed app)
      div.pa-4.text-xs-center
        div.display-1.py-4(style="color:#1565C0") {{setting['name']}}
        div
          v-btn(dark href="https://github.com/master-nan/vuetify-admin" color="primary")
            v-icon(left, dark) star
            span Github
      v-divider
      Menu
    Header(:clipped="clipped" :miniVariant="miniVariant" :drawer="drawer" @setDrawer="getDrawer" @setClipped="getClipped" @setFixed="getFixed" @setMiniVariant="getMiniVariant")
    v-layout
      transition(name="fade-transform" mode="out-in")
        router-view
    Footer(:fixed="fixed")
</template>
<script>
import Menu from '@/views/components/public/Menu'
import Header from '@/views/components/public/Header'
import Footer from '@/views/components/public/Footer'
export default {
  name: 'App',
  components: {
    Footer,
    Header,
    Menu
  },
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false
    }
  },
  computed: {
    setting () {
      return this.$store.getters.getSetting
    }
  },
  methods: {
    getClipped (v) {
      this.clipped = v
    },
    getFixed (v) {
      this.fixed = v
    },
    getMiniVariant (v) {
      this.miniVariant = v
    },
    getDrawer (v) {
      this.drawer = v
    }
  }
}
</script>
<style>
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.v-navigation-drawer__border{
  left:299px;
}
</style>
