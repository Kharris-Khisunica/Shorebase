// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@compodium/nuxt',
    '@vueuse/nuxt'
  ],
  plugins: [
    // '~/plugins/keycloak.client.ts'
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },
  ssr: false,

  runtimeConfig: {
    public: {
      HOST: process.env.NUXT_HOST,
      BACKEND_HOST: process.env.NUXT_BACKEND_HOST,
      KEYCLOAK_URL: process.env.NUXT_KEYCLOAK_URL,
      KEYCLOAK_REALM: process.env.NUXT_KEYCLOAK_REALM,
      KEYCLOAK_CLIENT_ID: process.env.NUXT_KEYCLOAK_CLIENT_ID,
    }
  },

  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/images/logo/shorebase-thumbnail.png' }]
    }
  }
})
