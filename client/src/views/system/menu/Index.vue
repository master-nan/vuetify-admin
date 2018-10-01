<template lang="pug">
  v-container
    v-card.mt-4
      div.pl-3
        div.font-weight-medium.display-1.py-4 {{ 'Menu'|i18nName('TableTitle',self) }}
      v-divider
      div
        v-btn.info.z-index-1(fab absolute top right dark to="add")
          v-icon add
      v-data-table.elevation-1(:loading="loading" :headers="headers" :items="data" hide-actions :total-items="30")
        template(slot="headerCell" slot-scope="props")
          v-tooltip(bottom)
            span(slot="activator") {{ props.header.text|i18nName('Table',self) }}
            span {{ props.header.text|i18nName('Table',self) }}
        template(slot="items" slot-scope="props")
          tr(:class="{'deep-purple lighten-5':props.item.child,'yellow lighten-4':props.item.kid}")
            td {{ props.item.id }}
            td.text-xs-left {{ props.item.pid }}
            td.text-xs-left {{ props.item.name }}
            td.text-xs-left {{ props.item.title }}
            td.text-xs-left {{ props.item.component }}
            td.text-xs-left {{ props.item.path }}
            td.text-xs-left
              v-chip(:color="props.item.show|statusChipFilter(2)|i18nName('Tag',self)" label outline) {{props.item.show|statusFilter(2)|i18nName('Tag',self)}}
            td.text-xs-left
              v-chip(:color="props.item.hidden|statusChipFilter(3)|i18nName('Tag',self)" label outline) {{props.item.hidden|statusFilter(3)|i18nName('Tag',self)}}
            td.text-xs-left
              v-chip(:color="props.item.status|statusChipFilter(1)|i18nName('Tag',self)" label outline) {{props.item.status|statusFilter(1)|i18nName('Tag',self)}}
            td.text-xs-left {{ props.item.sort }}
            td.justify-left
              v-btn.my-1.mr-2(fab small color="primary" dark @click="edit(props)")
                v-icon edit
              v-btn.my-1.mr-2(fab small color="error" dark @click="del(props)")
                v-icon delete
              v-btn.my-1.mr-2(round style="min-width:60px" v-if="props.item.status == 1" small color="warning" @click="enable(props)")
                slot {{'Disable'|i18nName('Button',self)}}
              v-btn.my-1.mr-2(round style="min-width:60px" v-else small color="success" @click="enable(props)")
                slot {{'Enable'|i18nName('Button',self)}}
              template(v-if="props.item.children")
                v-btn.my-1(fab small color="purple" dark @click="expand(props)")
                  v-icon(v-if="props.item.expand") mdi-arrow-up-bold
                  v-icon(v-else) mdi-arrow-down-bold
        template(slot="no-data")
          v-alert(:value="true" color="error" icon="warning") Sorry, no data!
    v-dialog(v-model="show" width="500px" persistent)
      v-card
        v-card-title.headline.grey.lighten-2(primary-title) 编辑菜单
        v-card-text
          v-form(ref="form" v-model="valid" lazy-validation)
            v-text-field(v-model="form.title" :rules="[v => !!v || 'Name is required']" label="标题" required)
            v-text-field(v-model="form.name" :rules="[v => !!v || 'Name is required']" label="名称" required)
            v-select(:items="options" label="父节点" item-text="title" item-value="id" :rules="pidRules" v-model="form.pid")
            v-switch(v-if="form.pid == 0" v-model="form.show" :label="`显示完整菜单：${form.show.toString()}`" color="success" hide-details required)
            v-switch(v-model="form.hidden" :label="`左侧隐藏：${form.hidden.toString()}`" color="indigo" hide-details required)
            v-text-field(v-model="form.component" label="主体" placeholder="示例：home (客户端components.js中)" required)
            v-text-field(v-model="form.path" label="访问路径" placeholder="示例：/index (子菜单请去掉/)" required)
            v-text-field(v-if="form.pid == 0" v-model="form.redirect" label="重定向" placeholder="示例：/index (子节点无效)" required)
            v-text-field(v-model="form.sort" label="排序" :rules="sortRules" required type="number")
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
  name: 'menu-index',
  data () {
    let zeroRules = (val) => {
      if (val || val === 0) {
        return true
      } else {
        return 'Name is required'
      }
    }
    return {
      self: this,
      loading: false,
      form: {
        title: null,
        name: null,
        show: true,
        hidden: true,
        component: null,
        pid: 0,
        path: null,
        icon: null,
        redirect: null,
        sort: 0
      },
      pidRules: [
        v => zeroRules(v)
      ],
      sortRules: [
        v => zeroRules(v)
      ],
      type: 1,
      index: 1,
      show: false,
      valid: true,
      headers: [
        { text: 'ID', sortable: false },
        { text: 'PID', sortable: false },
        { text: 'Name', sortable: false },
        { text: 'Title', sortable: false },
        { text: 'Component', sortable: false },
        { text: 'Path', sortable: false },
        { text: 'Show', sortable: false },
        { text: 'Hidden', sortable: false },
        { text: 'Status', sortable: false },
        { text: 'Sort', sortable: false },
        { text: 'Action', sortable: false }
      ],
      data: [],
      options: []
    }
  },
  methods: {
    expand (e) {
      if (e.item.children) {
        let index = e.index
        let children = e.item.children
        if (e.item.expand) {
          e.item.expand = false
          this.data.splice(index + 1, children.length)
        } else {
          let s = this
          _.forEach(children, function (value, key) {
            if (e.item.pid === 0) {
              value.child = true
            } else {
              value.kid = true
            }
            s.data.splice(index + 1 + key, 0, value)
          })
          e.item.expand = true
        }
      }
    },
    edit (e) {
      this.index = e.index
      this.form = util.cloneDeep(e.item)
      this.form.show = this.form.show === 1
      this.form.hidden = this.form.hidden === 1
      this.show = true
    },
    del (e) {
      let s = this
      this.$refs.comfirm.show(
        async function () {
          let res = await api.menu.del(e.item.id)
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
    cancel () {
      this.show = false
    },
    async enable (e) {
      let data = {
        'id': e.item.id,
        'status': e.item.status === 1 ? 2 : 1
      }
      let res = await api.menu.enable(data)
      util.response(res, this)
      if (res.code === 200) {
        e.item.status = data.status
      } else {
        this.$refs.message.open(res.error, 'error')
      }
    },
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        let res = await api.menu.update(this.form)
        this.$refs.loading.close()
        util.response(res, this)
        if (res.code === 200) {
          this.$refs.message.open('操作成功', 'success')
          this.show = false
          this.getData()
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
        this.options = util.cloneDeep(res.data)
        this.options.unshift({id: 0, title: '根节点'})
      }
    }
  },
  created () {
    this.getData()
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
