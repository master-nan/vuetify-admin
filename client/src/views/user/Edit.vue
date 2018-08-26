<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-btn(color="orange darken-2" dark @click="goback")
        v-icon(dark left) arrow_back
        slot {{'Back'|i18nName('Button',self)}}
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.name" :rules="nameRules" :counter="10" label="会员名称" required)
        v-text-field(v-model="form.area" :rules="nameRules" label="地区" required)
        v-text-field(v-model="form.remark" :rules="nameRules" label="备注" required)
        v-select(v-model="form.type" :items="items" item-text="title" item-value="value" :rules="[v => !!v || 'Item is required']" label="会员状态")
        v-btn(:disabled="!valid" @click="submit" color="primary")
          v-icon(dark left) check_circle
          slot {{'Submit'|i18nName('Button',self)}}
    MyLoading(ref="loading")
</template>
<script>
export default {
  name: 'user-edit',
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
