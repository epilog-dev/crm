import { serverSupabaseServiceRole } from '#supabase/server'

const KNOWN_FEATURES = new Set([
  'courier_tracking',
  'auto_payment_check',
  'team_inbox',
  'whatsapp_inbox',
  'repeat_buyer_insights'
])

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const raw = Array.isArray(body?.features) ? body.features : []
  const features = [...new Set(raw)].filter((f): f is string => typeof f === 'string' && KNOWN_FEATURES.has(f))

  if (!features.length) {
    throw createError({ statusCode: 400, message: 'features must include at least one known feature key' })
  }

  const client = serverSupabaseServiceRole(event)
  const { error } = await client
    .from('feature_votes')
    .insert(features.map(feature_key => ({ feature_key })))

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true, count: features.length }
})
