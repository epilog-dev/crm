import { watchDebounced } from '@vueuse/core'

export interface PagedResult<T> {
  items: T[]
  total: number
}

export interface PagedFetchParams {
  page: number
  pageSize: number
}

/**
 * Server-side pagination state for a list. `filters` is watched (debounced,
 * so typing in a search box doesn't fire a request per keystroke) and resets
 * to page 1; page changes fetch immediately. Out-of-order responses are
 * dropped so a slow earlier request can't overwrite a newer page.
 */
export function usePagedList<T, F extends Record<string, unknown>>(
  fetcher: (params: PagedFetchParams & F) => Promise<PagedResult<T>>,
  filters: Ref<F> | ComputedRef<F>,
  options: { pageSize?: number, debounce?: number } = {}
) {
  const items = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(options.pageSize ?? 20)
  const pending = ref(false)
  const error = ref<Error | null>(null)
  let requestId = 0

  async function refresh() {
    const id = ++requestId
    pending.value = true
    error.value = null
    try {
      const result = await fetcher({ page: page.value, pageSize: pageSize.value, ...filters.value })
      if (id !== requestId) return
      items.value = result.items
      total.value = result.total
      // Filters can shrink the result set below the current page.
      const lastPage = Math.max(1, Math.ceil(result.total / pageSize.value))
      if (page.value > lastPage) page.value = lastPage
    } catch (err) {
      if (id !== requestId) return
      error.value = err as Error
    } finally {
      if (id === requestId) pending.value = false
    }
  }

  watchDebounced(filters, () => {
    if (page.value !== 1) page.value = 1 // the page watcher fetches
    else refresh()
  }, { deep: true, debounce: options.debounce ?? 250 })

  watch([page, pageSize], refresh)

  return { items, total, page, pageSize, pending, error, refresh }
}
