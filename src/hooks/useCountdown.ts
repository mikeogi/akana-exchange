import { onBeforeUnmount, ref, watch } from 'vue'

const useCountdown = (cb: Function) => {
  const currentValue = ref(1)
  const initialValue = ref(0)
  const polling = ref<ReturnType<typeof setInterval> | null>(null)

  const start = (value: number) => {
    stop()
    currentValue.value = value
    initialValue.value = value
    polling.value = setInterval(() => {
      currentValue.value--
    }, 1 * 1000)
  }

  watch(currentValue, async (newValue) => {
    if (newValue < 1) {
      await cb()
      start(initialValue.value)
    }
  })

  onBeforeUnmount(() => {
    stop()
  })

  const stop = () => {
    if (polling.value) {
      clearInterval(polling.value)
      polling.value = null
    }
  }

  return { start, stop, value: currentValue }
}

export default useCountdown
