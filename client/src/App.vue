<template lang="pug">
  v-app
    transition(name="fade-transform" mode="out-in")
      router-view
</template>

<script>
export default {
  name: 'App'
}
</script>
