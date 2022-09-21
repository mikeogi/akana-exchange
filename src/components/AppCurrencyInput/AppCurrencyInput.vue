<template lang="pug">
div(:class='$style.component')
  div(:class='$style.field')
    label(:class='$style.label') {{ label }}
    input(
      type='text'
      :readonly="disable"
      inputmode='decimal'
      :class='$style.input'
      maxlength="18"
      :value="isNaN(amount) ? '' : amount"
      @input='$emit("update:amount", formatNumber(parseFloat($event.target.value)))'
      @keypress='isNumber'
    )
    button(
      type='button'
      ref="currencyButtonRef"
      :class='$style.currency_button'
      @click='handleClickCurrencyButton'
    )
      span(:class='$style.currency_button_label') {{ currentCurrency?.label || '-' }}
      span(:class='$style.currency_button_code') {{ currentCurrency?.code || '-' }}
      div(role='button' :class='[$style.currency_button_arrow, { [$style["__open"]]: openList }]') ➜
  div(
    v-click-outside="[handleClickOutsideList, excludeOutsideNodes]"
    :class='$style.currency_list'
  )
    AppListSearch(
      v-if="openList"
      :list='currencyList'
      :code='currencyCode'
      placeholder="Enter currency name"
      @update:code='handleSelectCurrency'
    )
</template>

<script lang="ts" setup>
// @TODO: problem import/export types in SFC. ex: https://github.com/vuejs/core/issues/4294
// @TODO: move the input for numbers to a separate component
import { computed, onMounted, ref } from 'vue'
import useIsNumber from '~/hooks/useIsNumber'
import { formatNumber } from '~/modules/swap/swapMath'
import type { IAppListSearch } from '~/components/AppListSearch/types'

interface IAppCurrencyInputProps {
  label?: string
  currencyList?: IAppListSearch['list']
  amount: number
  currencyCode: string
  disable?: boolean
}

onMounted(() => {
  excludeOutsideNodes.value.push(currencyButtonRef.value)
})

const props = withDefaults(defineProps<IAppCurrencyInputProps>(), {
  currencyList: () => [],
  label: undefined,
  placeholder: '',
  disable: false,
})

const emit = defineEmits<{
  (event: 'update:amount', payload: IAppCurrencyInputProps['amount']): void
  (
    event: 'update:currencyCode',
    payload: IAppCurrencyInputProps['currencyCode']
  ): void
}>()

const { isNumber } = useIsNumber()

const openList = ref(false)
const currencyButtonRef = ref<HTMLButtonElement | null>(null)
const excludeOutsideNodes = ref<Array<HTMLButtonElement | null>>([])

const currentCurrency = computed(() =>
  props.currencyList.find(({ code }) => code === props.currencyCode)
)

const handleClickOutsideList = () => {
  if (openList.value) {
    console.log('test 1')
    toggleList()
  }
}

const handleClickCurrencyButton = () => {
  console.log('test 1')
  toggleList()
}

const toggleList = () => {
  openList.value = !openList.value
}

const handleSelectCurrency = (code: string) => {
  emit('update:currencyCode', code)
  toggleList()
}
</script>

<style lang="scss" module scoped>
.component {
  position: relative;
}
.field {
  position: relative;
}
.label {
  position: absolute;
  left: 1.6rem;
  top: 0.8rem;
  font-size: 1.2rem;
  color: rgba(var(--text), 0.65);
}
.input {
  line-height: 2.4rem;
  width: 100%;
  font-size: 1.6rem;
  font-weight: 500;
  padding: 2.8rem 12.4rem 1.2rem 1.6rem;
  background-color: rgba(var(--accent), 0.85);
  color: rgba(var(--text));
  border-radius: 0.8rem;
  transition: 0.12s ease-out;
  &:focus {
    background-color: rgba(var(--accent));
  }
}
.currency_button {
  cursor: pointer;
  width: 12rem;
  position: absolute;
  padding-left: 1.2rem;
  padding-top: 0.8rem;
  left: auto;
  top: 0;
  right: 0;
  height: 100%;
  background-color: rgba(var(--accent));
  border-top-right-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  border-left: 0.04rem solid rgba(var(--background));
  transition: 0.12s ease-out;
  display: flex;
  flex-direction: column;
  grid-row-gap: 0.8rem;
  &:hover {
    .currency_button_arrow:not(.__open) {
      transform: rotate(90deg) translateX(0.8rem);
    }
  }
}
.currency_button_arrow {
  position: absolute;
  margin: auto;
  bottom: 0;
  top: 0;
  transition: 0.2s ease-out;
  color: rgba(var(--accent-text), 0.65);
  font-size: 2rem;
  width: 20px;
  height: 20px;
  transform: rotate(90deg) translateX(0.4rem);
  right: 1.6rem;
  &.__open {
    transform: rotate(-90deg) translateX(-0.4rem);
  }
}
.currency_button_label {
  color: rgba(var(--text), 0.65);
  font-size: 1.2rem;
  line-height: 1.2rem;
  width: 95%;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.currency_button_code {
  color: rgba(var(--text));
  font-size: 1.6rem;
  text-align: left;
  width: 60%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.currency_list {
  z-index: 3;
  margin-top: 0.2rem;
  position: absolute;
  width: 100%;
}
</style>
