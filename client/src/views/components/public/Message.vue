<template lang="pug">
  v-snackbar(v-model="show" :color="color" :timeout="timeout" :multi-line="true")
    v-icon(dark flat) {{icon}}
    slot {{message}}
    v-btn(dark flat @click="show = false")
      v-icon close
</template>
<script>
export default{
  name: 'position-index',
  data () {
    return {
      self: this,
      show: false,
      message: null,
      color: 'success',
      icon: 'check_circle',
      timeout: 1000
    }
  },
  methods: {
    open (message, color, t) {
      this.message = message
      if (color) {
        this.color = color
        switch (color) {
          case 'error':
            this.icon = 'warning'
            break
          case 'warning':
            this.icon = 'priority_high'
            break
          case 'info':
            this.icon = 'info'
            break
          default:
        }
      }
      if (t) this.timeout = t
      this.show = true
    },
    close () {
      this.show = false
    }
  }
}
</script>
