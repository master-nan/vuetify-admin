<template lang="pug">
    v-container
      v-layout(row wrap)
        v-flex(mr-10 xs12 sm6 md2)
          v-text-field(@keyup.enter.native="handleFilter" height="1" label="会员名称" outline clearable v-model="list.name")
        v-flex(mr-10 xs12 sm6 md2)
          v-text-field(@keyup.enter.native="handleFilter" height="1" label="地区" outline clearable v-model="list.area")
        v-flex(mr-10 xs12 sm6 md2)
          v-select(@change='handleFilter' height="1" :items="items" label="会员权限" outline item-text="title" item-value="value" clearable v-model="list.type")
        v-flex(xs1 sm1 md1 text-left)
          v-btn(fab dark color="primary" @click='handleFilter')
            v-icon(dark) search
      v-card.mt-20
        div
          v-btn.green(fab absolute top right dark)
            v-icon add
        <v-data-table :headers="headers" :items="data" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here :(</v-alert>
          </template>
        </v-data-table>
        div.text-xs-center.pt-3
          v-pagination(v-model="list.page" :length="pages" :total-visible="5")
          v-flex(xs12 sm12 md12 pt-3) 共{{count}}条&nbsp;&nbsp;&nbsp;&nbsp;前往&nbsp;&nbsp;
            input.input.text-center(v-model="p" @blur="changeCount" @keyup.enter="changeCount")
            slot &nbsp;&nbsp;页
</template>
<script>
export default{
  name: 'index',
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
    pagination: {},
    selected: [],
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
    desserts: []
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
      console.log(e)
    },
    del (e) {
      console.log(e)
    },
    getData () {
      // console.log($t())
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
