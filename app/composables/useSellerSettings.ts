import { useState, watch } from '#imports'
import { useStore } from './useStore'

export interface SellerSettings {
  upiId: string
  codEnabled: boolean
  requireReceiptUpload: boolean
  autoLinkDms: boolean
}

const SAVE_DEBOUNCE_MS = 600

export function useSellerSettings() {
  const { store, fetchStore, updateStore } = useStore()

  const sellerSettings = useState<SellerSettings>('sellerSettings', () => ({
    upiId: '',
    codEnabled: false,
    requireReceiptUpload: true,
    autoLinkDms: true
  }))

  const hydrated = useState('sellerSettingsHydrated', () => false)
  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  function applyFromStore() {
    if (!store.value) return
    hydrated.value = false
    sellerSettings.value = {
      upiId: store.value.upi_vpa ?? '',
      codEnabled: store.value.cod_enabled,
      requireReceiptUpload: store.value.require_receipt_upload,
      autoLinkDms: store.value.auto_link_dms
    }
    // Defer so the watcher below doesn't treat this hydration as a user edit.
    setTimeout(() => { hydrated.value = true }, 0)
  }

  async function load() {
    if (!store.value) await fetchStore()
    applyFromStore()
  }

  if (import.meta.client && !store.value && !hydrated.value) {
    load()
  } else if (import.meta.client && store.value && !hydrated.value) {
    applyFromStore()
  }

  watch(sellerSettings, (val) => {
    if (!hydrated.value) return
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      updateStore({
        upi_vpa: val.upiId,
        cod_enabled: val.codEnabled,
        require_receipt_upload: val.requireReceiptUpload,
        auto_link_dms: val.autoLinkDms
      }).catch((err) => {
        console.error('Failed to save seller settings', err)
      })
    }, SAVE_DEBOUNCE_MS)
  }, { deep: true })

  return {
    sellerSettings,
    load
  }
}
