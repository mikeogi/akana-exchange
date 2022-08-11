const delay = (s: number) =>
  new Promise((resolve) => setTimeout(resolve, s * 1000, true))

export default delay
