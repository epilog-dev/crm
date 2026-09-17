const currencyFormatters = new Map<string, Intl.NumberFormat>()

/** `formatMoney(1800)` → `₹1,800`. Falls back to the ISO code for unknown currencies. */
export function formatMoney(amount: number, currency = 'INR') {
  let formatter = currencyFormatters.get(currency)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 })
    currencyFormatters.set(currency, formatter)
  }
  return formatter.format(amount)
}

export function formatCompactNumber(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

export function formatTime(iso: string | null | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatRelativeTime(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
