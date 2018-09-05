<template lang="pug">
  v-container.container
    v-flex(xl3 lg4 xs12 sm12 md12)
      v-btn(color="orange darken-2" dark @click="goback")
        v-icon(dark left) arrow_back
        slot {{'Back'|i18nName('Button',self)}}
      v-form(ref="form" v-model="valid" lazy-validation)
        v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
        v-text-field(v-model="form.remark" :rules="[v => !!v || 'Remark is required']" label="备注" required)
        v-list.mt-3.menu-list(two-line)
          template(v-for="item in data")
            v-list-tile(@click="check(item)")
              v-list-tile-action
                v-checkbox(v-model="item.checked" color="success" :key="item.id")
              v-list-tile-content()
                v-list-tile-title {{item.title}}
                v-list-tile-sub-title {{item.name}}
            div.pl-4
              template(v-for="childItem in item.children")
                v-list-tile(@click="check(childItem)")
                  v-list-tile-action
                    v-checkbox(v-model="childItem.checked" color="success" :key="childItem.id")
                  v-list-tile-content
                    v-list-tile-title {{childItem.title}}
                    v-list-tile-sub-title {{childItem.name}}
                div.ml-10.ml-5
                  template(v-for="child in childItem.children")
                    v-list-tile(@click="check(child)")
                      v-list-tile-action
                        v-checkbox(v-model="child.checked" color="success" :key="child.id")
                      v-list-tile-content
                        v-list-tile-title {{child.title}}
                        v-list-tile-sub-title {{child.name}}
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
import _ from 'lodash'
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
      data: [],
      keys: []
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.form.rs = this.keys.toString()
        this.$refs.loading.open()
        let res = await api.rule.update(this.form)
        util.response(res, this)
        this.$refs.loading.close()
        if (res.code === 200) {
          this.$refs.message.open(res.error, 'success')
          util.toRouter('rule', this)
        } else {
          this.$refs.message.open(res.error, 'error')
        }
      }
    },
    goback () {
      this.$router.go(-1)
    },
    check (e) {
      let index = this.keys.indexOf(e.id)
      if (index > -1) {
        this.keys.splice(index, 1)
        e.checked = false
      } else {
        this.keys.push(e.id)
        e.checked = true
      }
      console.log(this.keys)
    },
    async getData () {
      this.loading = true
      let res = await api.menu.index()
      util.response(res, this)
      this.loading = false
      if (res.code === 200) {
        this.data = res.data
      }
    },
    async getRuleById () {
      this.form.id = this.$route.params.id ? this.$route.params.id : 0
      let res = await api.rule.read(this.form.id)
      util.response(res, this)
      if (res.code === 200) {
        this.form = res.data
        this.form.status = !!res.data.status
      } else {
        this.$refs.message.open(res.error, 'error')
        await util.sleep()
        util.toRouter('rule', this)
      }
      if (this.form.rs) {
        this.keys = this.form.rs.split(',').map(e => {
          return parseInt(e)
        })
      }
    },
    eachItems (item) {
      let s = this
      _.forEach(item, function (res) {
        if (s.keys.indexOf(res.id) > -1) {
          res.checked = true
        }
        if (res.children) {
          s.eachItems(res.children)
        }
      })
    }
  },
  created () {
    this.getRuleById()
    this.getData()
  },
  watch: {
    'data' (e) {
      this.eachItems(this.data)
    }
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
