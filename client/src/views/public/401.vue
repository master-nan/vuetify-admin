<template lang="pug">
    v-container
      div 401 您没有权限
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
