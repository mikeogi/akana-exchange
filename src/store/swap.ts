import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { navigateTo } from '#app'
import {
  ResponseFetchCurrencyList,
  ResponseFetchPairs,
  ResponseFetchRates,
} from '~/modules/swap/BaseApi'
import { MockSwapApi } from '~/modules/swap/MockApi'

/**
 * I am use pinia instead of vuex because nuxt3 not provided vuex plugin
 * doc: https://v3.nuxtjs.org/migration/configuration#vuex
 */

export interface ISwapStore {
  commonLoading: boolean
  currencies: {
    data: ResponseFetchCurrencyList['data']
    loading: boolean
    error?: Error
  }
  pairs: {
    data: ResponseFetchPairs['data']
    loading: boolean
    error?: Error
  }
  rates: {
    data: ResponseFetchRates['data']
    loading: boolean
    error?: Error
  }
  exchange: {
    loading: boolean
    error?: Error
  }
}

/**
 * throwing errors must be implemented in the api module
 */
const useSwap = defineStore('swap', () => {
  const api = new MockSwapApi()

  const $toast = useToast()

  const currencies = ref<ISwapStore['currencies']>({
    data: {},
    loading: false,
  })
  const pairs = ref<ISwapStore['pairs']>({
    data: {},
    loading: false,
  })
  const rates = ref<ISwapStore['rates']>({
    data: {},
    loading: false,
  })
  const exchange = ref<ISwapStore['exchange']>({
    loading: false,
  })
  const commonLoading = ref<ISwapStore['commonLoading']>(false)

  const errorHandler = (error: any) => {
    console.log('useSwap:errorHandler', error)
    if (error?.message) {
      $toast.error(error?.message || 'Something went wrong')
    }
  }

  const fetchCurrencyList = async () => {
    currencies.value.loading = true
    try {
      const response = await api.fetchCurrencyList()
      currencies.value.data = response.data
    } catch (err) {
      currencies.value.error =
        err instanceof Error
          ? err
          : new Error('Error when try to loading currency list')
      errorHandler(err)
    } finally {
      currencies.value.loading = false
    }
  }

  const fetchPairs = async () => {
    pairs.value.loading = true
    try {
      const response = await api.fetchPairs()
      pairs.value.data = response.data
    } catch (err) {
      pairs.value.error =
        err instanceof Error
          ? err
          : new Error('Error when try to loading pairs')
      errorHandler(err)
    } finally {
      pairs.value.loading = false
    }
  }

  const fetchRates = async () => {
    rates.value.loading = true
    try {
      const response = await api.fetchRates()
      rates.value.data = response.data
    } catch (err) {
      rates.value.error =
        err instanceof Error
          ? err
          : new Error('Error when try to loading rates')
      errorHandler(err)
    } finally {
      rates.value.loading = false
    }
  }

  const initialize = async () => {
    commonLoading.value = true
    try {
      await fetchCurrencyList()
      await fetchPairs()
      await fetchRates()
    } catch (err) {
      errorHandler(err)
    } finally {
      commonLoading.value = false
    }
  }

  const submitSwap = async (
    baseCurrency: string,
    quoteCurrency: string,
    amount: number
  ) => {
    exchange.value.loading = true
    try {
      if (!baseCurrency || !quoteCurrency || amount <= 0) {
        throw new Error('Invalid data')
      }
      const response = await api.submitSwap(baseCurrency, quoteCurrency, amount)
      await navigateTo(`/swap/${response.data.exchangeId}`)
    } catch (err) {
      exchange.value.error =
        err instanceof Error
          ? err
          : new Error('Error when try to submit exchange')
      errorHandler(err)
    } finally {
      exchange.value.loading = false
    }
  }

  return {
    commonLoading,
    currencies,
    pairs,
    rates,
    exchange,
    fetchCurrencyList,
    fetchPairs,
    fetchRates,
    submitSwap,
    initialize,
  }
})

export default useSwap
