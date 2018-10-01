<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex(mr-2 xs12 sm6 md2)
        v-text-field(@keyup.enter.native="handleFilter" height="1" label="昵称" outline clearable v-model="list.nickname")
      v-flex(mr-2 xs12 sm6 md2)
        v-select(height="1" :items="listDep" label="部门" outline item-text="name" item-value="id" clearable v-model="list.d_id")
      v-flex(mr-2 xs12 sm6 md2)
        v-select(height="1" :items="listPos" label="岗位" outline item-text="name" item-value="id" clearable v-model="list.p_id")
      v-flex(mr-2 xs12 sm6 md2)
        v-select(height="1" :items="items" label="状态" outline item-text="title" item-value="value" clearable v-model="list.status")
      v-flex(xs1 sm1 md1)
        v-btn(fab dark color="primary" @click='handleFilter')
          v-icon(dark) search
    v-card.mt-4(:class="{'pb-2':count}")
      div.pl-3
        div.font-weight-medium.display-1.py-4 {{ 'User'|i18nName('TableTitle',self) }}
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
          td.text-xs-left {{ props.item.nickname }}
          td.text-xs-left {{ props.item.d_name }}
          td.text-xs-left {{ props.item.p_name }}
          td.text-xs-left
            v-chip(:color="props.item.status|statusChipFilter(1)|i18nName('Tag',self)" label outline) {{props.item.status|statusFilter(1)|i18nName('Tag',self)}}
          td.justify-left
            v-btn.my-1.mr-2(fab small color="primary" dark @click="edit(props)")
              v-icon edit
            v-btn.my-1.mr-2(fab small color="error" dark @click="del(props)")
              v-icon delete
            v-btn.my-1(round style="min-width:60px" v-if="props.item.status == 1" small color="warning" @click="enable(props)")
              slot {{'Disable'|i18nName('Button',self)}}
            v-btn.my-1(round style="min-width:60px" v-else small color="success" @click="enable(props)")
              slot {{'Enable'|i18nName('Button',self)}}
        template(slot="no-data")
          v-alert(:value="true" color="error" icon="warning" outline) Sorry, no data!
      div.text-xs-center.pt-3(v-show="count > 0")
        v-pagination(v-model="list.page" :length="pages" :total-visible="5")
        v-flex(xs12 sm12 md12 pt-3) 共&nbsp;{{count}}&nbsp;条&nbsp;&nbsp;&nbsp;&nbsp;前往&nbsp;&nbsp;
          input.input.text-center(v-model="p" @blur="changePage" @keyup.enter="changePage")
          slot &nbsp;&nbsp;页
    v-dialog(v-model="show" width="500px" persistent)
      v-card
        v-card-title.headline.grey.lighten-2(primary-title) {{title}}
        v-card-text
          v-form(ref="form" v-model="valid" lazy-validation)
            v-text-field(v-model="ruleForm.nickname" :rules="[v => !!v || 'Nickname is required']" label="昵称" required)
            v-text-field(v-model="ruleForm.username" :rules="[v => !!v || 'Username is required']" label="用户名" required :disabled="type != 1")
            v-text-field(v-model="ruleForm.password" label="密码" type="password")
            v-select(v-model="ruleForm.d_id" :items="listDep" item-text="name" item-value="id" :rules="[v => !!v || 'Department is required']" label="部门")
            v-select(v-model="ruleForm.p_id" :items="listPos" item-text="name" item-value="id" :rules="[v => !!v || 'Position is required']" label="岗位")
            v-select(v-model="ruleForm.r_id" :items="listRule" item-text="name" item-value="id" :rules="[v => !!v || 'Rule is required']" label="权限")
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
        r_id: null
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
        status: null,
        page: 1,
        len: 15
      },
      type: 1,
      p: 1,
      count: 0,
      items: [
        { title: '启用', value: 1 },
        { title: '禁用', value: 2 }
      ],
      title: '添加用户'
    }
  },
  computed: {
    pages () {
      if (this.count == null) return 0
      return Math.ceil(this.count / this.list.len)
    }
  },
  methods: {
    changePage () {
      this.p = parseInt(this.p)
      if (isNaN(this.p)) {
        this.p = 1
      }
      if (this.p > this.pages) {
        this.p = this.pages
      }
      this.list.page = this.p
    },
    add () {
      this.title = '添加用户'
      this.type = 1
      this.show = true
      this.$nextTick(() => {
        this.$refs.form.reset()
        delete this.ruleForm.id
      })
    },
    edit (e) {
      this.title = '编辑用户'
      this.index = e.index
      this.type = 2
      this.ruleForm = util.cloneDeep(e.item)
      this.ruleForm.password = ''
      this.show = true
    },
    del (e) {
      let s = this
      this.$refs.comfirm.show(
        async function () {
          let res = await api.user.del(e.item.id)
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
      this.$nextTick(() => {
        this.$refs.form.reset()
        this.show = false
      })
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
        let res = null
        if (this.type === 1) {
          res = await api.user.save(this.ruleForm)
        } else {
          res = await api.user.update(this.ruleForm)
        }
        util.response(res, this)
        this.$refs.loading.close()
        if (res.code === 200) {
          this.$refs.message.open('操作成功', 'success')
          this.show = false
          this.getData()
          // this.$nextTick(() => {
          //   this.$refs.form.reset()
          // })
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
        this.count = res.count
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
  },
  watch: {
    'list.page' (val) {
      this.p = val
      this.getData()
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
