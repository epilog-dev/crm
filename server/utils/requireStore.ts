import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { H3Event } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

/**
 * Resolves the authenticated caller's store, auto-provisioning one on first
 * use (see `stores_after_insert_add_owner` trigger, which relies on this
 * running as the user's own client so `auth.uid()` resolves inside it).
 */
export async function requireStore(event: H3Event) {
  const client = await serverSupabaseClient<Database>(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const findMembership = () =>
    client
      .from('store_members')
      .select('role, stores(*)')
      .eq('user_id', user.sub)
      .limit(1)
      .maybeSingle()

  const { data: membership, error: membershipError } = await findMembership()
  if (membershipError) {
    throw createError({ statusCode: 500, message: membershipError.message })
  }

  if (membership?.stores) {
    return { client: client as SupabaseClient<Database>, user, store: membership.stores, role: membership.role }
  }

  const defaultName = user.email ? `${user.email.split('@')[0]}'s Store` : 'My Store'
  const { error: createErr } = await client.from('stores').insert({ name: defaultName })
  if (createErr) {
    throw createError({ statusCode: 500, message: createErr.message })
  }

  const { data: created, error: refetchError } = await findMembership()
  if (refetchError || !created?.stores) {
    throw createError({ statusCode: 500, message: refetchError?.message || 'Failed to provision store' })
  }

  return { client: client as SupabaseClient<Database>, user, store: created.stores, role: created.role }
}
