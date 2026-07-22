export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  components: {
    dirs: [
      { path: "~/components/shared", pathPrefix: false },
      { path: "~/components/task", pathPrefix: false },
    ],
  },

  css: ['~/assets/css/main.css'],

  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
    },
  },

  pinia: {
    storesDirs: ['~/stores/**'],
  },
})
