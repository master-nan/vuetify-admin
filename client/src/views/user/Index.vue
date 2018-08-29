<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex(mr-10 xs12 sm6 md2)
        v-text-field(@keyup.enter.native="handleFilter" height="1" label="会员名称" outline clearable v-model="list.name")
      v-flex(mr-10 xs12 sm6 md2)
        v-text-field(@keyup.enter.native="handleFilter" height="1" label="地区" outline clearable v-model="list.area")
      v-flex(mr-10 xs12 sm6 md2)
        v-select(@change='handleFilter' height="1" :items="items" label="会员权限" outline item-text="title" item-value="value" clearable v-model="list.type")
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
          td.text-xs-left {{ props.item.name }}
          td.text-xs-left {{ props.item.remark }}
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
            v-text-field(v-model="form.name" :rules="nameRules" label="部门名称" required)
            v-text-field(v-model="form.remark" label="备注" required)
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
export default{
  name: 'user-index',
  data () {
    return {
      self: this,
      loading: false,
      form: {
        name: null,
        remark: null,
        status: 1
      },
      type: 1,
      index: 1,
      show: false,
      valid: true,
      nameRules: [
        v => !!v || 'Name is required'
      ],
      headers: [
        { text: 'Index', sortable: false },
        { text: 'Name', align: 'left', sortable: false },
        { text: 'Remark', sortable: false },
        { text: 'Status', sortable: false },
        { text: 'Action', sortable: false }
      ],
      data: [
        {
          id: 1,
          name: 'Frozen Yogurt',
          remark: 115,
          status: 1
        },
        {
          id: 2,
          name: 'Ice cream sandwich',
          remark: 115,
          status: 1
        }
      ],
      list: {
        name: null,
        area: null,
        type: null
      },
      items: [
        { title: '普通会员', value: 1 },
        { title: '商家', value: 2 }
      ]
    }
  },
  methods: {
    add () {
      this.type = 1
      this.show = true
      this.$refs.form.reset()
    },
    edit (e) {
      this.type = 2
      this.index = e.index
      this.form = Object.assign({}, e.item)
      console.log(this.form)
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
    enable (e) {
      console.log('e=====', e)
      if (e.item.status === 1) {
        e.item.status = 2
        console.log('2')
      } else {
        e.item.status = 1
        console.log('1')
      }
      console.log(this.data)
    },
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        await util.sleep()
        this.$refs.loading.close()
        this.show = false
        this.$refs.message.open('操作成功', 'success')
        if (this.type === 1) {
          this.data.unshift(this.form)
        } else {
          // let a = Object.assign({}, this.form)
          console.log(this.form)
          this.data.splice(this.index, 1, this.form)
        }
      }
    },
    handleFilter () {
      if (this.loading) return
      this.getData()
    },
    getData () {
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
