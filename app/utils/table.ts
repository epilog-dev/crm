/** Shared UTable styling: bordered, rounded header, compact rows. */
export const dashboardTableUi = {
  base: 'table-fixed border-separate border-spacing-0',
  thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
  tbody: '[&>tr]:last:[&>td]:border-b-0',
  th: 'py-2 text-xs uppercase first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
  td: 'border-b border-default text-xs',
  separator: 'h-0'
} as const
