import IBaseSwapApi, {
  CurrencyListType,
  ResponseFetchCurrencyList,
  ResponseFetchPairs,
  ResponseFetchRates,
  ResponseSubmitSwap,
} from './BaseApi'
import delay from '~/helpers/delay'

const FAKE_CURRENCY_LIST: CurrencyListType = {
  CUP: { name: 'Cuban Peso' },
  USD: { name: 'US Dollar' },
  DKK: { name: 'Danish Krone' },
  GEL: { name: 'Lari' },
  EUR: { name: 'Euro' },
  UAH: { name: 'Hryvnia' },
  CNY: { name: 'Yuan Renminbi' },
  RUB: { name: 'Russian Ruble' },
  NOK: { name: 'Norwegian Krone' },
  GBP: { name: 'Pound Sterling' },
  JPY: { name: 'Yen' },
  KZT: { name: 'Tenge' },
  SGD: { name: 'Singapore Dollar' },
}

const FACTOR_LOADING = 1

export class MockSwapApi implements IBaseSwapApi {
  private makePairHasAnyData<T>(
    makeDataItem: (baseCode: string, quoteCode: string) => T
  ) {
    const result: { [K in string]: T } = {}
    Object.keys(FAKE_CURRENCY_LIST).forEach((el1, _, arr) => {
      arr.forEach((el2) => {
        if (el1 !== el2) {
          result[`${el1}/${el2}`] = makeDataItem(el1, el2)
        }
      })
    })
    return result
  }

  public async fetchPairs(hasError?: boolean) {
    console.log('MockSwapApi:fetchPairs')
    const data: ResponseFetchPairs['data'] = this.makePairHasAnyData<
      ResponseFetchPairs['data'][number]
    >((baseCode, quoteCode) => {
      return {
        fee: Math.floor(Math.random() * 5) + 1,
        baseCurrency: baseCode,
        quoteCurrency: quoteCode,
      }
    })
    await delay(0.86 * FACTOR_LOADING)
    if (hasError) {
      await Promise.reject(new Error('Error when try to loading pairs'))
    }
    const result: ResponseFetchPairs = { ok: true, data }
    return result
  }

  public async fetchCurrencyList(hasError?: boolean) {
    console.log('MockSwapApi:fetchCurrencyList')
    const data: ResponseFetchCurrencyList = {
      ok: true,
      data: FAKE_CURRENCY_LIST,
    }
    await delay(0.45)
    if (hasError) {
      await Promise.reject(new Error('Error when try to loading currency list'))
    }
    return data
  }

  public async fetchRates(hasError?: boolean) {
    console.log('MockSwapApi:fetchRates')
    const data: ResponseFetchRates['data'] = this.makePairHasAnyData<
      ResponseFetchRates['data'][number]
    >(() => {
      return { rate: Math.floor(Math.random() * (100 - 10) + 10) }
    })
    const result: ResponseFetchRates = { ok: true, data }
    await delay(0.66 * FACTOR_LOADING)
    if (hasError) {
      await Promise.reject(new Error('Error when try to loading rates'))
    }
    return result
  }

  public async submitSwap(
    baseCurrency: string,
    quoteCurrency: string,
    amount: number,
    hasError?: boolean
  ) {
    console.log('MockSwapApi:submitSwap', {
      baseCurrency,
      quoteCurrency,
      amount,
    })
    await delay(0.87 * FACTOR_LOADING)
    if (hasError) {
      await Promise.reject(new Error('Error when try to submit swap'))
    }
    const result: ResponseSubmitSwap = {
      ok: true,
      data: {
        exchangeId: Math.floor(Math.random() * (5000 - 1) + 1).toString(),
      },
    }
    return result
  }
}
