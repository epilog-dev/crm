import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const { store, role } = await requireStore(event)
  if (role !== 'owner') {
    throw createError({ statusCode: 403, message: 'Only the store owner can disconnect Instagram' })
  }

  const admin = serverSupabaseServiceRole<Database>(event)
  const account = await getInstagramAccountForStore(admin, store.id)

  // Best effort: stop Meta sending us webhooks for this account. A failure
  // here (e.g. token already revoked) shouldn't block the disconnect.
  if (account) {
    await unsubscribeFromWebhooks(account.access_token, account.ig_user_id).catch((err) => {
      console.error('Instagram unsubscribe failed:', (err as Error).message)
    })
    await removeInstagramConnection(admin, account.ig_user_id)
  }

  const { data, error } = await admin.from('stores').select().eq('id', store.id).single()
  if (error) throw createError({ statusCode: 500, message: error.message })
  return { ...data, role }
})
