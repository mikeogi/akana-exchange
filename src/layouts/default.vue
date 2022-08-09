<template lang="pug">
.AppLayout
  slot
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head'

useHead({
  bodyAttrs: {
    class: 'theme-dark',
  },
})
</script>

<style lang="scss">
.AppLayout {
  max-width: 1440px;
  padding: 2.4rem;
  margin: 0 auto;
}
</style>
