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
  setup_completed_at: string | null
  setup_dismissed_at: string | null
  created_at: string
  updated_at: string
  role?: 'owner' | 'staff'
}

export function useStore() {
  const store = useState<Store | null>('currentStore', () => null)
  const pending = useState<boolean>('currentStorePending', () => false)

  /** `silent` skips the `pending` flag -- for background refreshes that shouldn't show loading UI. */
  async function fetchStore(options: { silent?: boolean } = {}) {
    if (!options.silent) pending.value = true
    try {
      store.value = await $fetch<Store>('/api/store')
      return store.value
    } finally {
      if (!options.silent) pending.value = false
    }
  }

  async function updateStore(patch: Partial<Store>) {
    const updated = await $fetch<Store>('/api/store', { method: 'PATCH', body: patch })
    store.value = updated
    return updated
  }

  /** Records the first time the onboarding checklist was seen fully complete (server stamps the time once). */
  async function markSetupCompleted() {
    const updated = await $fetch<Store>('/api/store', { method: 'PATCH', body: { setup_completed: true } })
    store.value = updated
    return updated
  }

  /** Hides the completed onboarding checklist for good, for every device on this store. */
  async function dismissSetupChecklist() {
    const updated = await $fetch<Store>('/api/store', { method: 'PATCH', body: { setup_dismissed: true } })
    store.value = updated
    return updated
  }

  return {
    store,
    pending,
    fetchStore,
    updateStore,
    markSetupCompleted,
    dismissSetupChecklist
  }
}
