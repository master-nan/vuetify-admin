<template lang="pug">
    v-content.content
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
        v-data-table(:loading="false" :headers="headers" :items="desserts" hide-actions class="elevation-1" :total-items="30")
          template(slot="headerCell" slot-scope="props")
            v-tooltip(bottom)
              span(slot="activator") {{ props.header.text }}
              span {{ props.header.text }}
          template(slot="items" slot-scope="props")
            td {{ props.index + 1 }}
            td.text-xs-left {{ props.item.name }}
            td.text-xs-left {{ props.item.calories }}
            td.text-xs-left {{ props.item.fat }}
            td.text-xs-left {{ props.item.carbs }}
            td.text-xs-left {{ props.item.protein }}
            td.text-xs-left {{ props.item.iron }}
            td.justify-left
              v-btn.mr-10(fab small color="cyan" dark @click="edit(props)")
                v-icon edit
              v-btn(fab small color="error" dark @click="del(props)")
                v-icon delete
          template(slot="no-data")
            v-alert(:value="true" color="error" icon="warning") Sorry, no data!
        div.text-xs-center.pt-3.pb-3
          v-pagination(v-model="list.page" :length="pages" :total-visible="5")
          v-flex(xs12 sm12 md12 pt-3) 共{{count}}条&nbsp;&nbsp;&nbsp;&nbsp;前往&nbsp;&nbsp;
            input.input.text-center(v-model="p" @blur="changeCount" @keyup.enter="changeCount")
            slot &nbsp;&nbsp;页
</template>
<script>
import util from '@/utils'
export default{
  name: 'member-index',
  data: () => ({
    items: [
      { title: '普通会员', value: 1 },
      { title: '商家', value: 2 }
    ],
    data: [],
    loading: false,
    list: {
      name: null,
      area: null,
      page: 1,
      len: 15,
      type: null
    },
    p: 1,
    count: 515,
    headers: [
      { text: '序号', sortable: false },
      {
        text: 'Dessert (100g serving)',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Calories', value: 'calories', sortable: false },
      { text: 'Fat (g)', value: 'fat', sortable: false },
      { text: 'Carbs (g)', value: 'carbs', sortable: false },
      { text: 'Protein (g)', value: 'protein', sortable: false },
      { text: 'Iron (%)', value: 'iron', sortable: false },
      { text: 'Action', value: 'iron', sortable: false }
    ],
    desserts: [
      {
        id: 1,
        value: false,
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%'
      },
      {
        id: 2,
        value: false,
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1%'
      },
      {
        id: 3,
        value: false,
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7%'
      }
    ]
  }),
  computed: {
    pages () {
      if (this.count == null) return 0
      return Math.ceil(this.count / this.list.len)
    }
  },
  methods: {
    handleFilter () {
      if (this.loading) return
      this.list.page = 1
      this.getData()
    },
    edit (e) {
      util.toRouter('edit-member', this, {'id': e.item.id})
    },
    del (e) {
      console.log(e)
    },
    getData () {
      console.log(this.list.page)
    },
    changeCount () {
      this.p = parseInt(this.p)
      if (isNaN(this.p)) {
        this.p = 1
      }
      if (this.p > this.pages) {
        this.p = this.pages
      }
      this.list.page = this.p
    }
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
