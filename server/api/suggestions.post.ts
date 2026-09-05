import { serverSupabaseServiceRole } from '#supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!message || message.length > 2000) {
    throw createError({ statusCode: 400, message: 'message is required (max 2000 characters)' })
  }
  if (email && !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, message: 'email looks invalid' })
  }

  const client = serverSupabaseServiceRole(event)
  const { error } = await client
    .from('suggestions')
    .insert({ message, email: email || null })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { ok: true }
})
