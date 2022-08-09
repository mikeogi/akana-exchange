<template lang="pug">
div(:class='$style.component')
  input(
    type='text'
    v-model='searchString'
    :class='$style.input'
  )
  div(role='list' :class='$style.list')
    div(
      role='listitem'
      v-for="item in filteredList"
      :data-item="`${item.code}:${item.label}`"
      :key="`${item.code}:${item.label}`"
      :class='$style.list_item'
      @click='$emit("update:code", item.code)'
    )
      div(:class='$style.list_item_logo') 🪙
      div(:class='$style.list_item_info')
        div(:class='$style.list_item_info_label') {{ item.label }}
        div(:class='$style.list_item_info_code') {{ item.code }}
      div(v-if='code === item.code' :class='$style.list_item_current_item') ✔️
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { IAppListSearch } from '~/components/AppListSearch/types'

const props = withDefaults(
  defineProps<{
    list: IAppListSearch['list']
    code: string
  }>(),
  {}
)

defineEmits<{
  (event: 'update:code', payload: string): void
}>()

const searchString = ref('')

const filteredList = computed(() => {
  return props.list.filter((item) => {
    const formattedItem = `${item.code}${item.label}`.toLowerCase()
    return formattedItem.includes(searchString.value.toLowerCase())
  })
})
</script>

<style scoped lang="scss" module>
.component {
  background-color: rgba(var(--accent_2));
  border-radius: 0.4rem;
}
.input {
  width: 100%;
  line-height: 2.4rem;
  outline: none;
  border: none;
  font-size: 1.6rem;
  padding: 1.2rem 1.6rem;
}
.list {
  border-top: 0.02rem solid rgba(var(--extra));
  max-height: 38rem;
  overflow-y: auto;
  overflow-x: hidden;
}
.list_item {
  padding: 1.2rem 1.6rem;
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(var(--accent), 0.25);
  }
}
.list_item_logo {
}
.list_item_info {
  margin-left: 1.6rem;
}
.list_item_info_label {
}
.list_item_info_code {
}
.list_item_current_item {
  margin-left: auto;
}
</style>
