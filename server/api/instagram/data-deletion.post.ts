import { randomBytes } from 'node:crypto'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'

// Meta's data-deletion callback. We delete everything we hold *from Instagram*
// for that user (token + profile fields) and answer with a status URL + code,
// which is the shape Meta requires.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ signed_request?: string }>(event)
  const payload = parseSignedRequest(body?.signed_request)
  if (!payload?.user_id) {
    throw createError({ statusCode: 400, message: 'Invalid signed_request' })
  }

  const admin = serverSupabaseServiceRole<Database>(event)
  await removeInstagramConnection(admin, String(payload.user_id))

  const confirmationCode = randomBytes(6).toString('hex')
  return {
    url: `${appUrl(event)}/privacy?deletion=${confirmationCode}`,
    confirmation_code: confirmationCode
  }
})
