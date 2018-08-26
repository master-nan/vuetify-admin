<template lang="pug">
  v-layout(ref="my-loading" row justify-center)
      v-dialog(v-model="dialog" fullscreen persistent)
        v-progress-circular(:size="50" :width="5" color="purple" indeterminate)
        div.back
</template>
<script>
export default {
  data: () => ({
    dialog: false
  }),
  methods: {
    open () {
      this.dialog = true
    },
    close () {
      this.dialog = false
    }
  }
}
</script>
<style lang="less" scoped>
.v-progress-circular{
  position: fixed;
  top:calc(50% - 25px);
  left:calc(50% - 25px);
}
.back{
  position: fixed;
  top:0px;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background-color: #333333;
}
</style>
