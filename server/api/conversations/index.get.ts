import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const { data, error } = await client
    .from('conversations')
    .select('*, orders(id, order_code)')
    .order('last_message_at', { ascending: false, nullsFirst: false })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
