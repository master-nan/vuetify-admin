<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-btn(color="orange darken-2" dark @click="goback")
        v-icon(dark left) arrow_back
        slot {{'Back'|i18nName('Button',self)}}
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.title" :rules="[v => !!v || 'Name is required']" label="标题" required)
        v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
        v-select(:items="data" label="父节点" item-text="title" item-value="id" v-model="form.pid")
        v-switch(v-if="form.pid == 0" v-model="form.show" :label="`显示完整菜单：${form.show.toString()}`" color="success" hide-details required)
        v-switch(v-model="form.hidden" :label="`左侧隐藏：${form.hidden.toString()}`" color="indigo" hide-details required)
        v-text-field(v-model="form.component" label="主体" placeholder="示例：home (客户端components.js中)" required)
        v-text-field(v-model="form.path" label="访问路径" placeholder="示例：/index (子菜单请去掉/)" required)
        v-text-field(v-if="form.pid == 0" v-model="form.redirect" label="重定向" placeholder="示例：/index (子节点无效)" required)
        v-text-field(v-model="form.sort" label="排序" :rules="sortRules" required type="number")
        v-btn.mt-4(:disabled="!valid" @click="submit" color="primary")
          v-icon(dark left) check_circle
          slot {{'Submit'|i18nName('Button',self)}}
    MyLoading(ref="loading")
    MyMessage(ref="message")
</template>
<script>
import util from '@/utils'
import api from '@/api'
export default {
  name: 'menu-add',
  data () {
    let sortRules = (val) => {
      if (val || val === 0) {
        return true
      } else {
        return 'Name is required'
      }
    }
    return {
      self: this,
      valid: true,
      form: {
        title: null,
        name: null,
        show: true,
        hidden: true,
        component: null,
        pid: 0,
        path: null,
        icon: null,
        op: null,
        redirect: null,
        sort: 0
      },
      data: [],
      sortRules: [
        v => sortRules(v)
      ]
    }
  },
  methods: {
    async submit () {
      console.log(this.form)
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        let res = await api.menu.save(this.form)
        util.response(res, this)
        this.$refs.loading.close()
        if (res.code === 200) {
          this.$refs.message.open(res.error, 'success')
          this.clear()
        } else {
          this.$refs.message.open(res.error, 'error')
        }
      }
    },
    clear () {
      this.$refs.form.reset()
      this.$nextTick(() => {
        this.form.status = true
        this.keys = []
      })
    },
    goback () {
      this.$router.go(-1)
    },
    async getData () {
      this.loading = true
      let res = await api.menu.index()
      util.response(res, this)
      this.loading = false
      if (res.code === 200) {
        this.data = res.data
        this.data.unshift({id: 0, title: '根节点'})
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="less">
.menu-list {
  height: 420px;
  overflow-y: auto;
  .v-list__tile{
    height: 45px;
  }
}
</style>
