<template lang="pug">
  v-container
    v-layout(row wrap)
      v-flex.my-3(xs12 sm6)
        v-date-picker(v-model="date" :show-current="true" :landscape="true")
      v-flex.my-3(xs12 sm6)
      v-flex.my-3(xs12 sm6)
        v-time-picker.mt-3(v-model="time" type="month" height="400px" :landscape="true")
</template>
<script>
import util from '@/utils'
export default{
  name: 'index',
  data: () => ({
    date: null,
    time: null
  }),
  computed: {
  },
  methods: {
    getDate () {
      this.date = util.timeFilter(Date.parse(new Date()) / 1000, 'YYYY-MM-DD')
    },
    getTime () {
      this.time = util.timeFilter(Date.parse(new Date()) / 1000, 'HH:mm:ss')
      let self = this
      setTimeout(function () {
        self.getTime()
      }, 1000)
    }
  },
  created () {
    this.getDate()
    this.getTime()
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
</style>
