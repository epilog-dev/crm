// Starts the "Connect Instagram" flow: the seller lands on Meta's consent
// screen and comes back to /api/instagram/callback.
export default defineEventHandler(async (event) => {
  const { store, role } = await requireStore(event)
  if (role !== 'owner') {
    throw createError({ statusCode: 403, message: 'Only the store owner can connect Instagram' })
  }
  return sendRedirect(event, buildAuthorizeUrl(event, store.id), 302)
})
