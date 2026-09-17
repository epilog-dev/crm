// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/supabase"],
  runtimeConfig: {
    // Server-only. Set via NUXT_INSTAGRAM_* env vars.
    instagramAppId: "",
    instagramAppSecret: "",
    instagramWebhookVerifyToken: "",
    public: {
      // Set via NUXT_PUBLIC_APP_URL. Used for OAuth redirect + webhook URLs.
      appUrl: "",
    },
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "alternate icon", href: "/favicon.ico" },
      ],
    },
  },
  // colorMode: {
  //   preference: 'light',
  //   fallback: 'light'
  // },
  // Add the Supabase configuration below
  supabase: {
    redirect: false,
    // redirectOptions: {
    //   login: '/login',
    //   callback: '/confirm',
    //   exclude: ['/', '/login', '/register', '/order/*'],
    // }
  },
});
