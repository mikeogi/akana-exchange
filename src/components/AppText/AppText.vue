<template lang="pug">
component(:is='as' :class="['AppText', `__${variant}`, extraClass]")
  slot
</template>

<script lang="ts" setup>
import { type ThemeColors } from '~/constants/colors'

const props = withDefaults(
  defineProps<{
    color?: ThemeColors
    extraClass?: string
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label'
    variant?: 'title_1' | 'title_2' | 'body_1_normal' | 'body_1_bold'
  }>(),
  {
    as: 'span',
    color: '--text',
    variant: 'body_1_normal',
    extraClass: '',
  }
)
</script>

<style lang="scss">
.AppText {
  color: rgba(var(--text));
  &.__title_1 {
    font-size: 6.4rem;
    line-height: 6.4rem;
    letter-spacing: -0.02em;
    font-weight: 700;
  }
  &.__title_2 {
    font-size: 4.8rem;
    line-height: 5.6rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  &.__body_1_normal {
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 400;
  }
  &.__body_1_bold {
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 500;
  }
}
</style>
