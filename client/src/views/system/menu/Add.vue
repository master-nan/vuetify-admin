<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-btn(color="orange darken-2" dark @click="goback")
        v-icon(dark left) arrow_back
        slot {{'Back'|i18nName('Button',self)}}
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.title" :rules="[v => !!v || 'Name is required']" label="标题" required)
        v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
        v-text-field(v-model="form.pid" :rules="[v => !!v || 'Name is required']" label="父节点" required)
        v-switch(v-model="form.show" :label="`显示完整菜单：${form.show.toString()}`" color="success" hide-details required)
        v-switch(v-model="form.hidden" :label="`左侧隐藏：${form.hidden.toString()}`" color="indigo" hide-details required)
        v-text-field(v-model="form.component" :rules="[v => !!v || 'Remark is required']" label="主体" required)
        v-text-field(v-model="form.path" :rules="[v => !!v || 'Remark is required']" label="访问路径" placeholder="Start typing to Search" required)
        v-text-field(v-model="form.redirect" label="重定向" required)
        v-text-field(v-model="form.sort" label="排序" :rules="[v => !!v || 'sort is required']" required type="number")
        v-switch(v-model="form.status" :label="(form.status ? 'Enable' : 'Disable') | i18nName('Tag',self)" color="info" hide-details required)
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
        sort: 0,
        status: true
      },
      data: []
    }
  },
  methods: {
    async submit () {
      console.log(this.form)
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        let res = await api.rule.save(this.form)
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
