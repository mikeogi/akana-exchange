<template lang="pug">
div(:class='$style.container')
  NuxtLink(to='/' :class='$style.title_link')
    AppText(
      as='h1'
      variant='title_1'
      :class='$style.title'
    )
      | Akana Swap
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

<style lang="scss" module>
.container {
  max-width: 1440px;
  padding: 2.4rem;
  margin: 0 auto;
}
.title {
  margin-bottom: 3.2rem;
}
</style>
