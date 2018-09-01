<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex(mr-10 xs12 sm6 md2)
        v-text-field(@keyup.enter.native="handleFilter" height="1" label="昵称" outline clearable v-model="list.nickname")
      v-flex(mr-10 xs12 sm6 md2)
        v-select(@change='handleFilter' height="1" :items="listDep" label="部门" outline item-text="name" item-value="id" clearable v-model="list.d_id")
      v-flex(mr-10 xs12 sm6 md2)
        v-select(@change='handleFilter' height="1" :items="listPos" label="岗位" outline item-text="name" item-value="id" clearable v-model="list.p_id")
      v-flex(mr-10 xs12 sm6 md2)
        v-select(@change='handleFilter' height="1" :items="items" label="状态" outline item-text="title" item-value="value" clearable v-model="list.status")
      v-flex(xs1 sm1 md1)
        v-btn(fab dark color="primary" @click='handleFilter')
          v-icon(dark) search
    v-card.mt-20
      div.pl-3
        div.font-weight-medium.display-1.py-4 {{ 'User'|i18nName('TableTitle',self) }}
      v-divider
      div
        v-btn.info.z-index-1(fab absolute top right dark to="add")
          v-icon add
      v-data-table.elevation-1(:loading="false" :headers="headers" :items="data" hide-actions :total-items="30")
        template(slot="headerCell" slot-scope="props")
          v-tooltip(bottom)
            span(slot="activator") {{ props.header.text|i18nName('Table',self) }}
            span {{ props.header.text|i18nName('Table',self) }}
        template(slot="items" slot-scope="props")
          td {{ props.index + 1 }}
          td.text-xs-left {{ props.item.nickname }}
          td.text-xs-left {{ props.item.d_name }}
          td.text-xs-left {{ props.item.p_name }}
          td.text-xs-left
            v-chip(v-if="props.item.status == 1" color="success" label outline) {{props.item.status|statusFilter(1)|i18nName('Tag',self)}}
            v-chip(v-else color="error" label outline) {{props.item.status|statusFilter(1)|i18nName('Tag',self)}}
          td.justify-left
            v-btn.my-1.mr-10(fab small color="cyan" dark @click="edit(props)")
              v-icon edit
            v-btn.my-1.mr-10(fab small color="error" dark @click="del(props)")
              v-icon delete
            v-btn.my-1(style="min-width:60px" v-if="props.item.status == 1" small color="warning" @click="enable(props)")
              //- v-icon delete
              slot {{'Disable'|i18nName('Button',self)}}
            v-btn.my-1(style="min-width:60px" v-else small color="success" @click="enable(props)")
              //- v-icon delete
              slot {{'Enable'|i18nName('Button',self)}}
        template(slot="no-data")
          v-alert(:value="true" color="error" icon="warning") Sorry, no data!
    v-dialog(v-model="show", width="500px" persistent)
      v-card
        v-card-text
          v-form(ref="form" v-model="valid" lazy-validation)
            v-text-field(v-model="ruleForm.nickname" :rules="[v => !!v || 'Nickname is required']" label="昵称" required)
            v-text-field(v-model="ruleForm.username" :rules="[v => !!v || 'Username is required']" label="用户名" required disabled)
            v-text-field(v-model="ruleForm.password" label="密码" type="password")
            v-select(v-model="ruleForm.p_id" :items="listPos" item-text="name" item-value="id" :rules="[v => !!v || 'Position is required']" label="部门")
            v-select(v-model="ruleForm.d_id" :items="listDep" item-text="name" item-value="id" :rules="[v => !!v || 'Department is required']" label="岗位")
            v-select(v-model="ruleForm.rule_id" :items="listRule" item-text="name" item-value="id" :rules="[v => !!v || 'Rule is required']" label="权限")
            v-btn.mt-10.mr-10(@click="cancel" dark)
              v-icon(dark left) mdi-close-circle
              slot {{'Cancel'|i18nName('Button',self)}}
            v-btn.mt-10(:disabled="!valid" @click="submit" color="primary")
              v-icon(dark left) check_circle
              slot {{'Submit'|i18nName('Button',self)}}
    MyLoading(ref="loading")
    MyMessage(ref="message")
    MyComfirm(ref="comfirm")
</template>
<script>
import util from '@/utils'
import api from '@/api'
export default{
  name: 'user-index',
  data () {
    return {
      self: this,
      loading: false,
      ruleForm: {
        id: null,
        nickname: '',
        username: '',
        password: '',
        p_id: null,
        d_id: null,
        rule_id: null,
        status: 1
      },
      listPos: [],
      listDep: [],
      listRule: [],
      index: 1,
      show: false,
      valid: true,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      headers: [
        { text: 'Index', sortable: false },
        { text: 'Nickname', align: 'left', sortable: false },
        { text: 'Department', sortable: false },
        { text: 'Position', sortable: false },
        { text: 'Status', sortable: false },
        { text: 'Action', sortable: false }
      ],
      data: [],
      list: {
        nickname: '',
        d_id: null,
        p_id: null,
        status: null
      },
      items: [
        { title: '启用', value: 1 },
        { title: '禁用', value: 2 }
      ],
      item: []
    }
  },
  methods: {
    edit (e) {
      this.index = e.index
      this.ruleForm = util.cloneDeep(e.item)
      this.ruleForm.password = ''
      this.show = true
    },
    del (e) {
      let s = this
      this.$refs.comfirm.show(
        function () {
          s.data.splice(e.index, 1)
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
      let res = await api.user.enable(data)
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
        let res = await api.user.update(this.ruleForm)
        util.response(res, this)
        this.$refs.loading.close()
        if (res.code === 200) {
          this.$refs.message.open('操作成功', 'success')
          this.show = false
          this.ruleForm.status = this.data[this.index].status
          this.ruleForm.last_login_at = this.data[this.index].last_login_at
          this.ruleForm.last_logout_at = this.data[this.index].last_logout_at
          this.ruleForm.create_at = this.data[this.index].create_at
          this.ruleForm.d_name = util.returnName(this.ruleForm.d_id, this.listDep)
          this.ruleForm.p_name = util.returnName(this.ruleForm.p_id, this.listPos)
          this.ruleForm.r_name = util.returnName(this.ruleForm.rule_id, this.listRule)
          this.data.splice(this.index, 1, this.ruleForm)
        } else {
          this.$refs.message.open(res.error, 'error')
        }
      }
    },
    handleFilter () {
      if (this.loading) return
      this.getData()
    },
    async getData () {
      this.loading = true
      let res = await api.user.index(this.list)
      util.response(res, this)
      this.loading = false
      if (res.code === 200 || res.code === 204) {
        this.data = res.data
      }
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
  mounted () {
    this.getData()
  },
  created () {
    this.getPositions()
    this.getDepartments()
    this.getRules()
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
