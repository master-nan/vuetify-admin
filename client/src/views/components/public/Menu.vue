<template lang="pug">
  v-list
    template(v-for="item in getPrivateRouter")
      slot(v-if="!item.hidden")
        v-list-tile(v-if="!item.children" :to="combinePath(item.path)")
          v-list-tile-action
            v-icon {{item.meta.icon}}
          v-list-tile-title {{item.meta.title|i18nName('Menu',self)}}
        v-list-tile(v-else-if="!item.show && item.children && item.children.length == 1 && !item.children[0].hidden" :to="combinePath(item.path,item.children[0].path)")
          v-list-tile-action
            v-icon {{item.meta.icon}}
          v-list-tile-title {{item.meta.title|i18nName('Menu',self)}}
        v-list-group(v-else :prepend-icon="item.meta.icon" :group="item.name")
          v-list-tile(slot="activator")
            v-list-tile-title {{item.meta.title|i18nName('Menu',self)}}
          template(v-for="children in item.children")
            v-list-tile(v-if="!children.children && !children.hidden" :to="combinePath(item.path,children.path)")
              v-list-tile-action
              v-list-tile-title {{children.meta.title|i18nName('Menu',self)}}
              v-list-tile-action
                v-icon {{children.meta.icon}}
            v-list-group(v-else-if="children.children && !children.hidden" no-action sub-group :group="children.name")
              v-list-tile(slot="activator")
                v-list-tile-title {{children.meta.title|i18nName('Menu',self)}}
                v-list-tile-action
                  v-icon {{children.meta.icon}}
              v-list-tile(v-for="(child, i) in children.children" :key="i" :to="combinePath(item.path,children.path,child.path)")
                slot(v-if="!child.hidden")
                  v-list-tile-title {{child.meta.title|i18nName('Menu',self)}}
                  v-list-tile-action
                    v-icon {{child.meta.icon}}
</template>
<script>
import { mapGetters } from 'vuex'
import path from 'path'
export default {
  name: 'top',
  data () {
    return {
      self: this
    }
  },
  methods: {
    combinePath (a, b = '', c = '') {
      return path.resolve(a, b, c)
    }
  },
  computed: {
    ...mapGetters([
      'getPrivateRouter'
    ])
  }
}
</script>
<style lang="less" scoped>
.v-list__tile--active .v-list__tile__action i{
  color:#1976d2 !important;
}
</style>
