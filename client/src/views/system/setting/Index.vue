<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
        v-btn.mt-4(:disabled="!valid" @click="submit" color="primary")
          v-icon(dark left) check_circle
          slot {{'Submit'|i18nName('Button',self)}}
    MyLoading(ref="loading")
    MyMessage(ref="message")
</template>
<script>
import util from '@/utils'
import api from '@/api'
import store from '@/store'
export default {
  name: 'setting',
  data () {
    return {
      self: this,
      valid: true,
      form: {
        name: null
      }
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        let res = await api.setting.update(this.form)
        util.response(res, this)
        this.$refs.loading.close()
        if (res.code === 200) {
          let data = util.cloneDeep(this.form)
          store.dispatch('setSetting', data)
          this.$refs.message.open(res.error, 'success')
        } else {
          this.$refs.message.open(res.error, 'error')
        }
      }
    },
    async getData () {
      this.loading = true
      let res = await api.setting.index()
      util.response(res, this)
      this.loading = false
      if (res.code === 200) {
        this.form = res.data
      }
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="less">
</style>
