<template lang="pug">
  v-dialog(v-model="dialog"  width="400px" persistent)
    v-card
      v-card-title.warning.primary-title.pa-2
        v-icon warning
        slot {{'Title'|i18nName('Comfirm',self)}}
      v-divider
      v-card-text.pa-4.subheading {{'Content'|i18nName('Comfirm',self)}}
      v-divider
      v-card-actions.pa-2
        v-spacer
        v-btn.mr-2(@click="no" small)
          v-icon(dark small left) mdi-close-circle
          slot {{'No'|i18nName('Button',self)}}
        v-btn(@click="yes" color="primary" small)
          v-icon(dark small left) check_circle
          slot {{'Yes'|i18nName('Button',self)}}
</template>
<script>
export default {
  data () {
    return {
      self: this,
      dialog: false,
      comfirm: null,
      cancel: null
    }
  },
  methods: {
    show (comfirm, cancel) {
      this.dialog = true
      this.comfirm = comfirm
      this.cancel = cancel
    },
    close () {
      this.dialog = false
    },
    yes () {
      this.comfirm()
    },
    no () {
      this.cancel()
    }
  }
}
</script>
