// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  // colorMode: {
  //   preference: 'light',
  //   fallback: 'light'
  // },
  // Add the Supabase configuration below
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login', '/register', '/order/*'],
    }
  }
})