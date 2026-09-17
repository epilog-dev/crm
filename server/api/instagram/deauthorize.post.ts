import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'

// Meta calls this when a seller removes DMSell from Instagram → Settings →
// Apps and websites. Body is form-encoded: signed_request=<sig>.<payload>.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ signed_request?: string }>(event)
  const payload = parseSignedRequest(body?.signed_request)
  if (!payload?.user_id) {
    throw createError({ statusCode: 400, message: 'Invalid signed_request' })
  }

  const admin = serverSupabaseServiceRole<Database>(event)
  await removeInstagramConnection(admin, String(payload.user_id))
  return { ok: true }
})
