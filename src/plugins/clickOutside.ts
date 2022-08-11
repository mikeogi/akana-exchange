import { defineNuxtPlugin } from '#app'

/**
 * Example use:
 * v-click-outside="[func!: handleClickOutsideList, excludes?: [buttonRef]]"
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    beforeMount: (el, binding) => {
      el.clickOutsideEvent = (event: Event) => {
        const func = binding.value?.[0]
        const excludes = binding.value?.[1] as Node[]

        if (!func) {
          console.warn('directive click-outside - invalid args', binding)
          return
        }

        const isClickExcludedNode = excludes.some((node) => {
          return event.target && node.contains(event.target as Node)
        })

        if (
          !(
            el === event.target ||
            el.contains(event.target) ||
            isClickExcludedNode
          )
        ) {
          func(event, el)
          event.stopPropagation()
        }
      }
      document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted: (el) => {
      document.removeEventListener('click', el.clickOutsideEvent)
    },
  })
})
