/**
 * Route protection. Pages opt out of the login wall with
 * `definePageMeta({ auth: false })` (landing, privacy, public order page);
 * pages that only make sense signed-out (login, register) add
 * `guestOnly: true` and bounce signed-in users to the dashboard.
 *
 * Runs on the server too (the Supabase session lives in cookies), so a
 * signed-out hit on /app never even renders the dashboard shell.
 */
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (to.meta.guestOnly) {
    return user.value ? navigateTo('/app', { replace: true }) : undefined
  }

  if (to.meta.auth === false) return

  if (!user.value) {
    // Send them back where they were headed once they've signed in.
    const redirect = to.fullPath !== '/app' ? { redirect: to.fullPath } : {}
    return navigateTo({ path: '/login', query: redirect }, { replace: true })
  }
})
