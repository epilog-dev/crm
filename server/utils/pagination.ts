import type { H3Event } from 'h3'

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export interface PageParams {
  page: number
  pageSize: number
  /** Inclusive PostgREST range bounds. */
  from: number
  to: number
  /** Trimmed free-text search, or null. */
  q: string | null
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

function toInt(value: unknown, fallback: number) {
  const n = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(n) ? n : fallback
}

/** Reads `?page&pageSize&q` with sane clamps. */
export function parsePagination(event: H3Event): PageParams {
  const query = getQuery(event)
  const page = Math.max(1, toInt(query.page, 1))
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, toInt(query.pageSize, DEFAULT_PAGE_SIZE)))
  // Handles are stored without the @ people naturally type.
  const raw = typeof query.q === 'string' ? query.q.trim().replace(/^@/, '') : ''
  return { page, pageSize, from: (page - 1) * pageSize, to: page * pageSize - 1, q: raw || null }
}

/**
 * Makes a search term safe to interpolate into a PostgREST `or()` filter as a
 * double-quoted ilike value: quotes and backslashes are dropped (they escape
 * the quoting), `%` is dropped (LIKE wildcard), and the length is capped.
 * `_` is kept on purpose -- handles contain it, and as a single-character
 * wildcard it still matches the literal underscore.
 */
export function likePattern(q: string) {
  const cleaned = q.replace(/["\\%]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
  return cleaned ? `"%${cleaned}%"` : null
}

export function pageResponse<T>(items: T[] | null, total: number | null, params: PageParams): Page<T> {
  return { items: items ?? [], total: total ?? 0, page: params.page, pageSize: params.pageSize }
}
