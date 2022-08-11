<template lang="pug">
div(:class='$style.component')
  input(
    type='text'
    v-model='searchString'
    :placeholder="props.placeholder"
    :class='$style.input'
  )
  div(role='list' :class='$style.list')
    div(
      role='listitem'
      v-for="item in filteredList"
      :data-item="`${item.code}:${item.label}`"
      :key="`${item.code}:${item.label}`"
      :class='[$style.list_item, { [$style["__hover"]]: selectionItem === item.code }]'
      @click='$emit("update:code", item.code)'
      @mouseover="onChangeCurrentSelectionItem(item.code)"
      @mouseleave="onChangeCurrentSelectionItem(null)"
    )
      div(:class='$style.list_item_logo') 🪙
      div(:class='$style.list_item_info')
        div(:class='$style.list_item_info_label') {{ item.label }}
        div(:class='$style.list_item_info_code') {{ item.code }}
      div(v-if='code === item.code' :class='$style.list_item_current_item') ✔️
    div(v-if='isEmptyFilteredList' :class='$style.empty_list_text')  🤷🏻‍♀️
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { IAppListSearch } from '~/components/AppListSearch/types'

// @TODO: fix list scroll
// onMounted(() => {
//   document.addEventListener('keydown', (e) => {
//     e.preventDefault()
//     const { value: selectValue } = selectionItem
//     const { value: filteredListValue } = filteredList
//     const currentIdx = filteredListValue.findIndex(
//       ({ code }) => code === selectValue
//     )
//     const isFirst = currentIdx === 0
//     const isLast = currentIdx === filteredListValue.length - 1
//     const isDown = e.code === 'ArrowDown'
//     const isUp = e.code === 'ArrowUp'
//     const isEnter = e.code === 'Enter'
//     if (!selectValue && (isDown || isUp)) {
//       onChangeCurrentSelectionItem(filteredListValue[0]?.code)
//     } else if (isDown && isLast) {
//       onChangeCurrentSelectionItem(filteredListValue[0]?.code)
//     } else if (isDown) {
//       onChangeCurrentSelectionItem(filteredListValue[currentIdx + 1]?.code)
//     } else if (isUp && isFirst) {
//       onChangeCurrentSelectionItem(
//         filteredListValue[filteredListValue.length - 1]?.code
//       )
//     } else if (isUp) {
//       onChangeCurrentSelectionItem(filteredListValue[currentIdx - 1]?.code)
//     } else if (isEnter && selectValue) {
//       emits('update:code', selectValue)
//     }
//   })
// })

const props = withDefaults(
  defineProps<{
    list: IAppListSearch['list']
    code: string
    placeholder?: string
  }>(),
  {
    placeholder: '',
  }
)

defineEmits<{
  (event: 'update:code', payload: string): void
}>()

const searchString = ref('')

const selectionItem = ref<string | null>(null)

const filteredList = computed(() => {
  return props.list.filter((item) => {
    const formattedItem = `${item.code}${item.label}`.toLowerCase()
    return formattedItem.includes(searchString.value.toLowerCase())
  })
})

const isEmptyFilteredList = computed(() => filteredList.value.length < 1)

const onChangeCurrentSelectionItem = (value: string | null) => {
  selectionItem.value = value
}
</script>

<style scoped lang="scss" module>
.component {
  background-color: rgba(var(--accent_2));
  border-radius: 0.4rem;
}
.input {
  border-radius: 0.4rem;
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
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
}
.list_item {
  padding: 1.2rem 1.6rem;
  display: flex;
  width: 100%;
  align-items: center;
  cursor: pointer;
  &.__hover {
    background-color: rgba(var(--accent), 0.25);
  }
}
.list_item_logo {
  font-size: 2.4rem;
}
.list_item_info {
  margin-left: 1.6rem;
}
.list_item_info_label {
  font-weight: 700;
  font-size: 1.2rem;
}
.list_item_info_code {
  font-weight: 100;
  opacity: 0.45;
  font-size: 1.6rem;
}
.list_item_current_item {
  margin-left: auto;
}
.empty_list_text {
  width: 100%;
  line-height: 8rem;
  font-size: 4.8rem;
  text-align: center;
}
</style>
