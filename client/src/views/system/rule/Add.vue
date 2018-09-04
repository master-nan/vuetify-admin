<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-btn(color="orange darken-2" dark @click="goback")
        v-icon(dark left) arrow_back
        slot {{'Back'|i18nName('Button',self)}}
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
        v-text-field(v-model="form.remark" :rules="[v => !!v || 'Remark is required']" label="备注" required)
        <v-list two-line>
          <template v-for="(item, index) in data">
            <v-list-tile  @click="check(item)">
              <v-list-tile-action>
                <v-checkbox v-model="item.checked" color="success" value="item.value" :key="item.value"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content  @click="check(item)">
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
                <v-list-tile-sub-title>{{item.name}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
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
        name: null,
        remark: null,
        status: true,
        rs: null
      },
      notifications: false,
      data: [],
      items: [
        { header: 'Today' },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ]
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
    check (e) {
      console.log(e)
      if (e.checked) {
        e.checked = false
      } else {
        e.checked = true
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
    this.getData()
  }
}
</script>
<style lang="less" scoped>
.v-list--two-line{
  .v-list__tile{
    height: auto;
  }
}
</style>
