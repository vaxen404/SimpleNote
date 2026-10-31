
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/icon/module', '@nuxtjs/mdc'],

  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
        viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
        style: [
            {
                key: 'css-layer-order',
                innerHTML: '@layer theme, base, components, utilities;'
            }
        ]
    }
  },

  components: true,

  imports: {
    dirs: [
      'composables/**',
      'utils/**',
      '~~/shared/schemas/**'
    ]
  },

  nitro: {
    imports: {
      dirs: [
        '~~/shared/schemas/**'
      ]
    }
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@vue/devtools-core', 'zod', 'remark-emoji']
    }
  }
})
