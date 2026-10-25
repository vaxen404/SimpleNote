
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/icon/module', '@nuxtjs/mdc'],

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  components: true,

  imports: {
    dirs: [
        'composables',
        'composables/**',
        'utils',
        'utils/**',
        'shared/schemas',
        'shared/schemas/**'
    ]
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@vue/devtools-core']
    }
  }
})
