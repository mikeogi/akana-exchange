export type CurrencyListType = { [K in string]: { name: string } }

export type ResponseFetchPairs = {
  ok: boolean
  data: {
    [K in string]: {
      fee: number
      baseCurrency: string
      quoteCurrency: string
    }
  }
  error?: Error
}

export type ResponseFetchCurrencyList = {
  ok: boolean
  data: CurrencyListType
  error?: Error
}

export type ResponseFetchRates = {
  ok: boolean
  data: {
    [K in string]: { rate: number }
  }
  error?: Error
}

export type ResponseSubmitSwap = {
  ok: boolean
  data: {
    exchangeId: string
  }
  error?: Error
}

export default interface IBaseSwapApi {
  // Get a list of currencies with the full name
  fetchCurrencyList(): Promise<ResponseFetchCurrencyList>
  // Get a pairs of currencies with the fee
  fetchPairs(): Promise<ResponseFetchPairs>
  // Get a pairs of currencies with the rate
  fetchRates(): Promise<ResponseFetchRates>
  submitSwap(
    baseCurrency: string,
    quoteCurrency: string,
    amount: number
  ): Promise<ResponseSubmitSwap>
}
