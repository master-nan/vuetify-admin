<template lang="pug">
  v-container
    v-card.mt-20
      div.pl-3
        div.font-weight-medium.display-1.py-4 {{ 'Menu'|i18nName('TableTitle',self) }}
      v-divider
      div
        v-btn.info.z-index-1(fab absolute top right dark @click.stop="add")
          v-icon add
      v-data-table.elevation-1(:loading="false" :headers="headers" :items="data" hide-actions :total-items="30")
        template(slot="headerCell" slot-scope="props")
          v-tooltip(bottom)
            span(slot="activator") {{ props.header.text }}
            span {{ props.header.text }}
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
  name: 'menu-index',
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
        },
        {
          id: 3,
          name: 'Eclair',
          remark: 115,
          status: 1
        }
      ]
    }
  },
  methods: {
    add () {
      this.type = 1
      this.show = true
    },
    edit (e) {
      this.type = 2
      this.index = e.index
      this.form = util.cloneDeep(e.item)
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
      if (e.item.status === 1) {
        e.item.status = 2
      } else {
        e.item.status = 1
      }
    },
    async submit () {
      if (this.$refs.form.validate()) {
        this.$refs.loading.open()
        await util.sleep()
        this.$refs.loading.close()
        this.show = false
        this.$refs.message.open('操作成功', 'success')
        if (this.type === 1) {
          let d = [
            {
              name: this.form.name,
              remark: this.form.remark,
              status: this.form.status
            }
          ]
          this.data = d.concat(this.data)
        } else {
          this.data[this.index] = util.cloneDeep(this.form)
        }
        this.$refs.form.reset()
      }
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
