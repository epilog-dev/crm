export interface Store {
  id: string
  name: string
  instagram_handle: string | null
  instagram_business_id: string | null
  instagram_username: string | null
  instagram_avatar_url: string | null
  instagram_followers_count: number | null
  instagram_connected: boolean
  instagram_connected_at: string | null
  webhook_status: string | null
  upi_vpa: string | null
  cod_enabled: boolean
  require_receipt_upload: boolean
  auto_link_dms: boolean
  created_at: string
  updated_at: string
  role?: 'owner' | 'staff'
}

export function useStore() {
  const store = useState<Store | null>('currentStore', () => null)
  const pending = useState<boolean>('currentStorePending', () => false)

  async function fetchStore() {
    pending.value = true
    try {
      store.value = await $fetch<Store>('/api/store')
      return store.value
    } finally {
      pending.value = false
    }
  }

  async function updateStore(patch: Partial<Store>) {
    const updated = await $fetch<Store>('/api/store', { method: 'PATCH', body: patch })
    store.value = updated
    return updated
  }

  return {
    store,
    pending,
    fetchStore,
    updateStore
  }
}
