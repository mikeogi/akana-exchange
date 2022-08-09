const useIsNumber = () => {
  const floatRegex = /^[0-9]*\.?[0-9]*$/

  const isNumber = (event: KeyboardEvent) => {
    if (floatRegex.test(event.key)) {
      return true
    } else {
      event.preventDefault()
    }
  }

  return { isNumber }
}

export default useIsNumber
