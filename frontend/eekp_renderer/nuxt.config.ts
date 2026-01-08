// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 8000
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100 // Check for changes every 100ms
      }
    }
  }
})
