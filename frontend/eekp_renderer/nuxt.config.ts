// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@element-plus/nuxt'
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 8000
  },
  runtimeConfig: {
    // Diese Werte sind nur server-seitig verfügbar (sicher)
    keystorePath: 'certs/keystore.p12',
    keystorePassword: 'Schokolade1411!',
    truststorePath: 'certs/server-ca.pem',
    birthQuestionairePath: 'questionaires/put_geburt.json',
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100 // Check for changes every 100ms
      }
    }
  },
  elementPlus: {
    // Options
    icon: 'ElIcon', // Optional: imports icons with a prefix (e.g., <ElIconEdit />)
    importStyle: 'css', // Use 'scss' if you want to override variables later
  },

})
