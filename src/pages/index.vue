<template lang="pug">
div.IndexPage
  AppText(as='h1' variant='title_1')
    | Akana Swap
  br
  br
  br
  br
  br
  AppCurrencyInput(
    v-model:amount='amount'
    v-model:currencyCode='currencyCode'
    label='Your send'
    :currencyList='currencyList'
  )
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const amount = ref(10)
const currencyCode = ref('GEL')
const currencyList = computed(() => {
  return [
    { code: 'CUP', label: 'Cuban Peso' },
    { code: 'USD', label: 'US Dollar' },
    { code: 'DKK', label: 'Danish Krone' },
    { code: 'GEL', label: 'Lari' },
    { code: 'EUR', label: 'Euro' },
    { code: 'UAH', label: 'Hryvnia' },
    { code: 'CNY', label: 'Yuan Renminbi' },
    { code: 'RUB', label: 'Russian Ruble' },
    { code: 'NOK', label: 'Norwegian Krone' },
    { code: 'GBP', label: 'Pound Sterling' },
    { code: 'JPY', label: 'Yen' },
    { code: 'KZT', label: 'Tenge' },
    { code: 'SGD', label: 'Singapore Dollar' },
  ]
})
</script>
