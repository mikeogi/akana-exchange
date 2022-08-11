import BigNumber from 'bignumber.js'

// Usually this value is obtained from api
const DECIMAL = 6
export const formatNumber = (value: number): number => {
  return parseFloat(new BigNumber(value).toFixed(DECIMAL))
}

/**
 * Get price for base in quote including commission
 * @param rate
 * @param fee
 */
const getQuoteForOneBaseHasFee = (rate: number, fee: number) => {
  return rate - (rate * fee) / 100
}

/**
 * Get price for 1quote in base including commission
 * @param rate
 * @param fee
 */
const getBaseForOneQuoteHasFee = (rate: number, fee: number) => {
  return 1 / getQuoteForOneBaseHasFee(rate, fee)
}

/**
 * Get final value for baseInput
 * @param quoteAmount
 * @param rate
 * @param fee
 */
export const getFinalBasePrice = (
  quoteAmount: number,
  rate: number,
  fee: number
) => {
  return formatNumber(quoteAmount * getBaseForOneQuoteHasFee(rate, fee))
}

/**
 * Get final value for quoteInput
 * @param baseAmount
 * @param rate
 * @param fee
 */
export const getFinalQuotePrice = (
  baseAmount: number,
  rate: number,
  fee: number
) => {
  return formatNumber(baseAmount * getQuoteForOneBaseHasFee(rate, fee))
}
