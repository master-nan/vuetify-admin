<template lang="pug">
  v-container
    v-card.mt-4
      div.pl-3
        div.font-weight-medium.display-1.py-4 {{ 'Rule'|i18nName('TableTitle',self) }}
      v-divider
      div
        v-btn.info.z-index-1(fab absolute top right dark @click.stop="add")
          v-icon add
      v-data-table.elevation-1(:loading="loading" :headers="headers" :items="data" hide-actions)
        template(slot="headerCell" slot-scope="props")
          v-tooltip(bottom)
            span(slot="activator") {{ props.header.text|i18nName('Table',self) }}
            span {{ props.header.text|i18nName('Table',self) }}
        template(slot="items" slot-scope="props")
          td {{ props.index + 1 }}
          td.text-xs-left {{ props.item.name }}
          td.text-xs-left {{ props.item.rs }}
          td.text-xs-left {{ props.item.remark }}
          td.text-xs-left
            v-chip(:color="props.item.status|statusChipFilter(1)|i18nName('Tag',self)" label outline) {{props.item.status|statusFilter(1)|i18nName('Tag',self)}}
          td.justify-left
            v-btn.my-1.mr-2(fab small color="cyan" dark @click="edit(props)")
              v-icon edit
            v-btn.my-1.mr-2(fab small color="error" dark @click="del(props)")
              v-icon delete
            v-btn.my-1(style="min-width:60px" v-if="props.item.status == 1" small color="warning" @click="enable(props)")
              slot {{'Disable'|i18nName('Button',self)}}
            v-btn.my-1(style="min-width:60px" v-else small color="success" @click="enable(props)")
              slot {{'Enable'|i18nName('Button',self)}}
        template(slot="no-data")
          v-alert(:value="true" color="error" icon="warning" outline) Sorry, no data!
    v-dialog(v-model="show" width="500px" persistent)
      v-card
        v-card-title.headline.grey.lighten-2(primary-title) 编辑权限
        v-card-text
          v-form(ref="form" v-model="valid" lazy-validation)
            v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
            v-text-field(v-model="form.remark" :rules="[v => !!v || 'Remark is required']" label="备注" required)
            v-list.mt-3.menu-list(two-line)
              template(v-for="item in items")
                v-list-tile(@click="check(item)")
                  v-list-tile-action
                    v-checkbox(v-model="item.checked" color="success" :key="item.id")
                  v-list-tile-content
                    v-list-tile-title {{item.title}}
                    v-list-tile-sub-title {{item.name}}
                div.ml-3
                  template(v-for="childItem in item.children")
                    v-list-tile(@click="check(childItem)")
                      v-list-tile-action
                        v-checkbox(v-model="childItem.checked" color="success" :key="childItem.id")
                      v-list-tile-content
                        v-list-tile-title {{childItem.title}}
                        v-list-tile-sub-title {{childItem.name}}
                    div.ml-5
                      template(v-for="child in childItem.children")
                        v-list-tile(@click="check(child)")
                          v-list-tile-action
                            v-checkbox(v-model="child.checked" color="success" :key="child.id")
                          v-list-tile-content
                            v-list-tile-title {{child.title}}
                            v-list-tile-sub-title {{child.name}}
            v-btn.mt-2.mr-2(@click="cancel" dark)
              v-icon(dark left) mdi-close-circle
              slot {{'Cancel'|i18nName('Button',self)}}
            v-btn.mt-2(:disabled="!valid" @click="submit" color="primary")
              v-icon(dark left) check_circle
              slot {{'Submit'|i18nName('Button',self)}}
    MyLoading(ref="loading")
    MyMessage(ref="message")
    MyComfirm(ref="comfirm")
</template>
<script>
import util from '@/utils'
import api from '@/api'
import _ from 'lodash'
export default{
  name: 'rule-index',
  data () {
    return {
      self: this,
      loading: false,
      form: {
        name: null,
        remark: null,
        rs: null
      },
      valid: true,
      headers: [
        { text: 'Index', sortable: false },
        { text: 'Name', sortable: false },
        { text: 'Rs', sortable: false },
        { text: 'Remark', sortable: false },
        { text: 'Status', sortable: false },
        { text: 'Action', sortable: false }
      ],
      data: [],
      show: false,
      items: [],
      keys: []
    }
  },
  methods: {
    cancel () {
      this.show = false
    },
    add () {
      util.toRouter('addRule', this)
    },
    edit (e) {
      // util.toRouter('editRule', this, {'id': e.item.id})
      this.index = e.index
      this.form = util.cloneDeep(e.item)
      if (this.form.rs) {
        this.keys = this.form.rs.split(',').map(e => {
          return parseInt(e)
        })
      }
      this.show = true
    },
    async submit () {
      if (this.$refs.form.validate()) {
        this.form.rs = this.keys.toString()
        this.$refs.loading.open()
        let res = await api.rule.update(this.form)
        util.response(res, this)
        this.$refs.loading.close()
        if (res.code === 200) {
          this.$refs.message.open(res.error, 'success')
          this.show = false
          this.getData()
        } else {
          this.$refs.message.open(res.error, 'error')
        }
      }
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
    },
    del (e) {
      let s = this
      this.$refs.comfirm.show(
        async function () {
          let res = await api.rule.del(e.item.id)
          util.response(res, this)
          if (res.code === 200) {
            s.data.splice(e.index, 1)
            s.$refs.message.open(res.error)
          } else {
            s.$refs.message.open(res.error, 'error')
          }
          s.$refs.comfirm.close()
        },
        function () {
          s.$refs.comfirm.close()
        })
    },
    async enable (e) {
      let data = {
        'id': e.item.id,
        'status': e.item.status === 1 ? 2 : 1
      }
      let res = await api.rule.enable(data)
      util.response(res, this)
      if (res.code === 200) {
        e.item.status = data.status
      } else {
        this.$refs.message.open(res.error, 'error')
      }
    },
    async getMenu () {
      let res = await api.menu.index()
      util.response(res, this)
      if (res.code === 200) {
        this.items = res.data
      }
    },
    async getData () {
      this.loading = true
      let res = await api.rule.index(this.list)
      util.response(res, this)
      this.loading = false
      if (res.code === 200 || res.code === 204) {
        this.data = res.data
      }
    }
  },
  created () {
    this.getMenu()
    this.getData()
  },
  watch: {
    'form' (e) {
      this.eachItems(this.items)
    }
  }
}
</script>
<style lang="less" scoped>
.v-btn{
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
table tr{
  th span{
    font-size:14px;
  }
  td{
    font-size:14px;
  }
}
</style>
