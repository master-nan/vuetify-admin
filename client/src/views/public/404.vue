<template lang="pug">
    v-container
      div 404 页面不存在
      v-btn(dark @click="goback" color="primary")
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    }
  }
}
</script>
