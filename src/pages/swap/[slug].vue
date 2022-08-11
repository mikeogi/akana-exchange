<template lang="pug">
div(:class='$style.container')
   AppText(variant='title_2' as='h2') Exchange: {{ $route.params?.slug }}
   div(:class='$style.success_container')
    div(:class='$style.success_icon') 🎉
    AppText(
      :class='$style.success_text'
      variant='title_2'
      as='h2'
    ) Exchange completed. Money sent to your account
</template>

<script lang="ts" setup>
import { useRoute } from '#app'
import AppText from '~/components/AppText/AppText.vue'

useRoute()
</script>

<style scoped module lang="scss">
@import '@/assets/css/media_mixin.scss';

.container {
}
.success_container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin-top: 4rem;
}
.success_icon {
  font-size: 24rem;
  margin-bottom: 4rem;
  @include _768 {
    font-size: 20rem;
  }
}
.success_text {
  text-align: center;
}
</style>
