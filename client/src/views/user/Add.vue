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
        v-select(v-model="form.p_id" :items="listPos" item-text="title" item-value="value" :rules="[v => !!v || 'Position is required']" label="部门")
        v-select(v-model="form.d_id" :items="listDep" item-text="title" item-value="value" :rules="[v => !!v || 'Department is required']" label="岗位")
        v-select(v-model="form.rule_id" :items="listRule" item-text="title" item-value="value" :rules="[v => !!v || 'Rule is required']" label="权限")
        v-switch(v-model="form.status" :label="(form.status ? 'Enable' : 'Disable') | i18nName('Tag',self)" color="info" :value="form.status" hide-details required)
        v-btn.mt-4(:disabled="!valid" @click="submit" color="primary")
          v-icon(dark left) check_circle
          slot {{'Submit'|i18nName('Button',self)}}
    MyLoading(ref="loading")
</template>
<script>
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
      listRule: [],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: [
        { title: '普通会员', value: 1 },
        { title: '商家', value: 2 }
      ],
      checkbox: false
    }
  },
  methods: {
    submit () {
      let self = this
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        setTimeout(function () {
          self.$refs.loading.close()
        }, 3000)
      }
    },
    clear () {
      this.$refs.form.reset()
    },
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>
