import { useState } from '#imports'

export interface SellerSettings {
  upiId: string
  codEnabled: boolean
  requireReceiptUpload: boolean
  autoLinkDms: boolean
}

export function useSellerSettings() {
  const sellerSettings = useState<SellerSettings>('sellerSettings', () => ({
    upiId: 'retrothrift@upi',
    codEnabled: false, // Default: COD disabled by seller
    requireReceiptUpload: true,
    autoLinkDms: true
  }))

  return {
    sellerSettings
  }
}
