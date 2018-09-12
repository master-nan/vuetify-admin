<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
        v-text-field(v-model="form.remark" :rules="[v => !!v || 'Remark is required']" label="备注" required)
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
  name: 'setting',
  data () {
    return {
      self: this,
      valid: true,
      form: {
        name: null,
        remark: null,
        rs: null
      },
      data: [],
      keys: []
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.form.rs = this.keys.toString()
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
  }
}
</script>
<style lang="less">
</style>
