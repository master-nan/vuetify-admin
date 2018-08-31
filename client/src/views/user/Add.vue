<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-btn(color="orange darken-2" dark @click="goback")
        v-icon(dark left) arrow_back
        slot {{'Back'|i18nName('Button',self)}}
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.nickname" :rules="[v => !!v || 'Nickname is required']" label="昵称" required)
        v-text-field(v-model="form.username" :rules="[v => !!v || 'Username is required']" label="用户名" required)
        v-text-field(v-model="form.password" :rules="[v => !!v || 'Password is required']" label="密码" type="password")
        v-select(v-model="form.p_id" :items="listPos" item-text="name" item-value="id" :rules="[v => !!v || 'Position is required']" label="部门")
        v-select(v-model="form.d_id" :items="listDep" item-text="name" item-value="id" :rules="[v => !!v || 'Department is required']" label="岗位")
        v-select(v-model="form.rule_id" :items="listRule" item-text="name" item-value="id" :rules="[v => !!v || 'Rule is required']" label="权限")
        v-switch(v-model="form.status" :label="(form.status ? 'Enable' : 'Disable') | i18nName('Tag',self)" color="info" :value="form.status" hide-details required)
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
  name: 'user-add',
  data () {
    return {
      self: this,
      valid: true,
      form: {
        nickname: '',
        username: '',
        password: '',
        p_id: null,
        d_id: null,
        rule_id: null,
        status: true
      },
      listPos: [],
      listDep: [],
      listRule: []
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        let res = await api.user.save(this.form)
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
      })
    },
    goback () {
      this.$router.go(-1)
    },
    async getPositions () {
      let res = await api.position.index({'status': 1})
      util.response(res, this)
      if (res.code === 200) {
        this.listPos = res.data
      }
    },
    async getDepartments () {
      let res = await api.department.index({'status': 1})
      util.response(res, this)
      if (res.code === 200) {
        this.listDep = res.data
      }
    },
    async getRules () {
      let res = await api.rule.index({'status': 1})
      util.response(res, this)
      if (res.code === 200) {
        this.listRule = res.data
      }
    }
  },
  created () {
    this.getPositions()
    this.getDepartments()
    this.getRules()
  }
}
</script>
