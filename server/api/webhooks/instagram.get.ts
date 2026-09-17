// Meta webhook verification handshake. Called once when you click
// "Verify and save" in the App Dashboard, and again on any re-subscribe.
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const mode = query['hub.mode']
  const token = query['hub.verify_token']
  const challenge = query['hub.challenge']

  const expected = useRuntimeConfig().instagramWebhookVerifyToken
  if (!expected) {
    throw createError({ statusCode: 500, message: 'NUXT_INSTAGRAM_WEBHOOK_VERIFY_TOKEN is not set' })
  }

  if (mode !== 'subscribe' || token !== expected || typeof challenge !== 'string') {
    throw createError({ statusCode: 403, message: 'Webhook verification failed' })
  }

  // Meta expects the raw challenge string echoed back, not JSON.
  setResponseHeader(event, 'content-type', 'text/plain')
  return challenge
})
