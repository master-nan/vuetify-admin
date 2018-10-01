<template lang="pug">
  v-container
    v-card.mt-4
      div.pl-3
        div.font-weight-medium.display-1.py-4 {{ 'Position'|i18nName('TableTitle',self) }}
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
    v-dialog(v-model="show" width="500px" persistent)
      v-card
        v-card-title.headline.grey.lighten-2(primary-title) {{title}}
        v-card-text
          v-form(ref="form" v-model="valid" lazy-validation)
            v-text-field(v-model="ruleForm.name" :rules="nameRules" label="岗位名称" required)
            v-text-field(v-model="ruleForm.remark" label="备注" required)
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
  name: 'position-index',
  data () {
    return {
      self: this,
      loading: false,
      ruleForm: {
        name: null,
        remark: null
      },
      type: 1,
      show: false,
      valid: true,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      headers: [
        { text: 'Index', sortable: false },
        { text: 'Name', sortable: false },
        { text: 'Status', sortable: false },
        { text: 'Action', sortable: false }
      ],
      data: [],
      title: '添加岗位'
    }
  },
  methods: {
    add () {
      this.title = '添加岗位'
      this.type = 1
      this.show = true
      this.$nextTick(() => {
        this.$refs.form.reset()
        delete this.ruleForm.id
      })
    },
    edit (e) {
      this.title = '编辑岗位'
      this.type = 2
      this.ruleForm = util.cloneDeep(e.item)
      this.show = true
    },
    del (e) {
      let s = this
      this.$refs.comfirm.show(
        async function () {
          let res = await api.position.del(e.item.id)
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
      let res = await api.position.enable(data)
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
          res = await api.position.save(this.ruleForm)
          this.$refs.loading.close()
        } else {
          res = await api.position.update(this.ruleForm)
        }
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
      let res = await api.position.index()
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
