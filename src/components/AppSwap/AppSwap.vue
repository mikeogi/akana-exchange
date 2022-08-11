<template lang="pug">
div(:class='$style.component')
  div(:class='$style.title')
    AppText(variant='title_2' as='h2') Exchange currency
  div(
    :class='[$style.form, { [$style["__loading"]]: commonLoading || exchangeLoading }]'
  )
    div(:class='$style.fields')
      AppCurrencyInput(
        label='Your send'
        v-model:amount='baseAmount'
        v-model:currencyCode='baseCurrency'
        @update:amount="calcQuoteAmount"
        @update:currencyCode="calcQuoteAmount"
        :class="[$style.field, $style.base_field]"
        :currencyList='baseCurrencyList'
      )
      button(
        type='button'
        :class='[$style.swap_fields_button, { [$style["__rotate"]]: rotateButton }]'
        @click='handleSwapFields'
      ) 💱
      AppCurrencyInput(
        label='Your get'
        v-model:amount='quoteAmount'
        v-model:currencyCode='quoteCurrency'
        @update:amount="calcBaseAmount"
        @update:currencyCode="calcBaseAmount"
        :class="[$style.field, $style.quote_field]"
        :currencyList='quoteCurrencyList'
      )
    div(:class='$style.exchange_meta_info')
      AppText(
        v-if="ratesLoading || commonLoading"
        variant='caption'
        color='text'
      )
        | ...
      AppText(
        v-else
        variant='caption'
        color='text'
      )
        | 1 {{ baseCurrency }} = {{ rate }} {{ quoteCurrency }}. Fee {{ fee }}%
        br
        | Price updated after {{ secToFetchRates }} sec
    button(
      type='button'
      :class='$style.submit_button'
      @click='handleSubmit'
    ) Exchange
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import useSwap from '~/store/swap'
import AppText from '~/components/AppText/AppText.vue'
import delay from '~/helpers/delay'
import { getFinalBasePrice, getFinalQuotePrice } from '~/modules/swap/swapMath'
import useCountdown from '~/hooks/useCountdown'
import { FETCH_RATES_INTERVAL } from '~/modules/swap/constants'

onMounted(async () => {
  await swapStore.initialize()
  const firstPair = Object.values(swapStore.pairs.data)[0]
  baseCurrency.value = firstPair?.baseCurrency || '-'
  quoteCurrency.value = firstPair?.quoteCurrency || '-'
  await startPollingRates(FETCH_RATES_INTERVAL)
})

onBeforeUnmount(() => {
  if (pollingRates.value) {
    clearInterval(pollingRates.value)
    pollingRates.value = null
  }
})

const swapStore = useSwap()

const { start: startPollingRates, value: secToFetchRates } = useCountdown(
  async () => {
    await swapStore.fetchRates()
    calcQuoteAmount()
  }
)

const baseCurrency = ref('')
const baseAmount = ref(0)
const quoteCurrency = ref('')
const quoteAmount = ref(0)
const pollingRates = ref<ReturnType<typeof setInterval> | null>(null)
const rotateButton = ref(false)

const commonLoading = computed(() => swapStore.commonLoading)
const ratesLoading = computed(() => swapStore.rates.loading)
const exchangeLoading = computed(() => swapStore.exchange.loading)

const baseCurrencyList = computed(() => {
  const data = swapStore.currencies.data
  return Object.keys(swapStore.currencies.data).map((key) => ({
    code: key,
    label: data[key].name,
  }))
})
const quoteCurrencyList = computed(() => {
  const data = swapStore.pairs.data
  return Object.keys(data)
    .filter((key) => data[key].baseCurrency === baseCurrency.value)
    .map((key) => {
      const code = data[key].quoteCurrency
      return { code, label: swapStore.currencies.data[code].name }
    })
})
const pairName = computed(() => {
  if (baseCurrency.value && quoteCurrency.value) {
    return `${baseCurrency.value}/${quoteCurrency.value}`
  }
  return null
})
const rate = computed(() => {
  if (!pairName.value) {
    return null
  }
  const rateItem = swapStore.rates.data[pairName.value]
  if (rateItem) {
    return rateItem.rate
  }
  return null
})
const fee = computed(() => {
  if (!pairName.value) {
    return null
  }
  const feeItem = swapStore.pairs.data[pairName.value]
  if (feeItem) {
    return feeItem.fee
  }
  return null
})

const handleSwapFields = async () => {
  rotateButton.value = true
  const oldBase = baseCurrency.value
  baseCurrency.value = quoteCurrency.value
  quoteCurrency.value = oldBase
  if (baseAmount.value >= quoteAmount.value) {
    baseAmount.value = quoteAmount.value
    calcBaseAmount()
  } else {
    quoteAmount.value = baseAmount.value
    calcQuoteAmount()
  }
  await delay(0.6)
  rotateButton.value = false
}

const calcBaseAmount = () => {
  if (quoteAmount.value && rate.value && fee.value) {
    baseAmount.value = getFinalBasePrice(
      quoteAmount.value,
      rate.value,
      fee.value
    )
  } else {
    baseAmount.value = 0
  }
}
const calcQuoteAmount = () => {
  if (baseAmount.value && rate.value && fee.value) {
    quoteAmount.value = getFinalQuotePrice(
      baseAmount.value,
      rate.value,
      fee.value
    )
  } else {
    quoteAmount.value = 0
  }
}

const handleSubmit = async () => {
  await swapStore.submitSwap(
    baseCurrency.value,
    quoteCurrency.value,
    baseAmount.value
  )
}
</script>

<style scoped lang="scss" module>
.component {
  width: 100%;
  padding: 1.2rem;
  background-color: rgba(var(--swap-bg));
  border-radius: 0.4rem;
}
.title {
  margin-bottom: 1.6rem;
}
.form {
  transition: 0.2s ease-out;
  &.__loading {
    pointer-events: none;
    opacity: 0.6;
  }
}
.fields {
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-row-gap: 0.4rem;
  position: relative;
  margin-bottom: 0.8rem;
}
.field {
  width: 100%;
}
.base_field {
}
.quote_field {
}
.swap_fields_button {
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  margin: auto;
  width: 4.4rem;
  height: 4.4rem;
  background-color: rgba(var(--swap_button));
  font-size: 3.2rem;
  position: absolute;
  align-self: center;
  z-index: 2;
  border-radius: 50%;
  padding-top: 0.2rem;
  line-height: 0;
  border: 0.3rem solid rgba(var(--swap-bg));
  &.__rotate {
    animation: rotate 0.6s ease-out infinite;
  }
}
.exchange_meta_info {
  height: 4rem;
}
.submit_button {
  outline: none;
  border: 0.2rem solid rgba(var(--swap_button));
  color: rgba(var(--swap_button));
  background-color: rgba(var(--swap_button), 0.1);
  border-radius: 0.4rem;
  width: 100%;
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.8rem;
  padding: 1.2rem 1.2rem;
  transition: 0.2s ease-out;
  &:hover {
    background-color: rgba(var(--swap_button));
    color: rgba(var(--accent-text));
  }
  &:active {
    transform: translateY(0.2rem);
  }
}
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
