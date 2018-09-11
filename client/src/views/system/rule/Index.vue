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
              //- v-icon delete
              slot {{'Disable'|i18nName('Button',self)}}
            v-btn.my-1(style="min-width:60px" v-else small color="success" @click="enable(props)")
              //- v-icon delete
              slot {{'Enable'|i18nName('Button',self)}}
        template(slot="no-data")
          v-alert(:value="true" color="error" icon="warning" outline) Sorry, no data!
    MyLoading(ref="loading")
    MyMessage(ref="message")
    MyComfirm(ref="comfirm")
</template>
<script>
import util from '@/utils'
import api from '@/api'
export default{
  name: 'rule-index',
  data () {
    return {
      self: this,
      loading: false,
      form: {
        name: null,
        remark: null,
        status: 1,
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
      data: []
    }
  },
  methods: {
    add () {
      util.toRouter('addRule', this)
    },
    edit (e) {
      util.toRouter('editRule', this, {'id': e.item.id})
    },
    del (e) {
      let s = this
      this.$refs.comfirm.show(
        async function () {
          let res = await api.rule.del(e.item.id)
          util.response(res, this)
          if (res.code === 200) {
            s.data.splice(e.index, 1)
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
