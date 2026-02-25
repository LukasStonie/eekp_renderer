import { en } from "element-plus/es/locales.mjs";
import { env } from "node:process";
import binary from "./server/api/binary";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',

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

    authKeystorePath: env.AUTH_KEYSTORE_PATH,
    authKeystorePassword: env.AUTH_CERT_PASSWORD,
    samlEntryPoint: env.SAML_ENTRY_POINT,
    samlUsername: env.SAML_USERNAME,
    samlPassword: env.SAML_PASSWORD,
    ctxID: env.ctxID,
    ORG_ID: env.ORG_ID,

    hcpEntryPoint: env.HCP_ENTRY_POINT,

    kbsEntryPoint: env.KBS_ENTRY_POINT,
    xdsPid: env.XDS_PID,
    ISO_TIME: env.ISO_TIME,

    jwtEntryPoint: env.JWT_ENTRY_POINT,
    jwtUsername: env.JWT_USERNAME,
    jwtPassword: env.JWT_PASSWORD,
    grantType: env.GRANT_TYPE,
    scope: env.SCOPE,
    patientId: env.PATIENT_ID,

    binaryEndpoint: env.BINARY_ENDPOINT,
    questionaireResponsesEndpoint: env.QUESTIONAIRE_RESPONSES_ENDPOINT,
    public: {
      // Diese Werte sind auch client-seitig verfügbar (unsicher)
      eekpBase: env.EEKP_BASE,
      eekpAliveEndpoint: env.ALIVE_ENDPOINT,
      eekpFindDocumentReferenceEndpoint: env.FIND_DOCUMENT_REFERENCE_ENDPOINT,
      defaultQuestionaireIdentifierSystem: env.DEFAULT_QUESTIONAIRE_IDENTIFIER_SYSTEM

    }
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
