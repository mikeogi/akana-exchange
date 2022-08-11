<template lang="pug">
div.IndexPage
  div(:class='$style.swap_container')
    AppSwap
</template>

<script lang="ts" setup>
import AppSwap from '~/components/AppSwap/AppSwap.vue'
</script>

<style lang="scss" module scoped>
.swap_container {
  max-width: 48rem;
  margin: 12% auto 0 auto;
}
</style>
