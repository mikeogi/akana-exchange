import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',
  typescript: {
    strict: true,
  },
  alias: {
    '~styles': '<srdDir>/assets/css',
  },
  css: ['@/assets/css/main.scss'],
  modules: ['@pinia/nuxt'],
})
