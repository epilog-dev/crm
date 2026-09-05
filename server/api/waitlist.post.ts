import { serverSupabaseServiceRole } from '#supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source = body?.source === 'hero' ? 'hero' : 'early_access'

  if (!email || !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'Enter a valid email address' })
  }

  const client = serverSupabaseServiceRole(event)

  const { error } = await client
    .from('waitlist_signups')
    .insert({ email, source })

  // Unique violation (already on the list) is a soft success, not an error.
  if (error && error.code !== '23505') {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true, alreadyJoined: error?.code === '23505' }
})
