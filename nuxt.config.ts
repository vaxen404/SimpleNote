
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/icon/module'],

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  components: true,

  imports: {
    autoImport: true
  },

  vite: {
    plugins: [tailwindcss()]
  }
})
