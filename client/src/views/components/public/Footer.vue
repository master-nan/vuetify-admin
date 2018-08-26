<template lang='pug'>
  v-footer(:fixed="fixed" app)
    v-flex(primary lighten-2 py-3 text-xs-center white--text xs12)
      slot &copy;2018 —
      strong  master-nan
      slot &nbsp;&nbsp;&nbsp;&nbsp;Email —
      strong  jszj_dwy1989@163.com
</template>
<script>

export default {
  name: 'foot',
  props: ['fixed']
}
</script>
