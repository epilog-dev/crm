import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

/**
 * Resolves the authenticated caller's store, auto-provisioning one on first
 * use via the `get_or_create_store` DB function. That function serializes
 * concurrent calls with an advisory lock (keyed on auth.uid()) so parallel
 * requests on first login -- e.g. the layout's store, orders, and
 * notifications fetches firing at once -- can't each create their own store.
 */
export async function requireStore(event: H3Event) {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const { data: store, error } = await client.rpc('get_or_create_store').single()

  if (error || !store) {
    throw createError({ statusCode: 500, message: error?.message || 'Failed to resolve store' })
  }

  const { data: membership } = await client
    .from('store_members')
    .select('role')
    .eq('store_id', store.id)
    .eq('user_id', user.sub)
    .maybeSingle()

  return { client: client as SupabaseClient<Database>, user, store, role: membership?.role ?? 'owner' }
}
