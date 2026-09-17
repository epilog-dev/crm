import type { BadgeProps } from '@nuxt/ui'
import type { OrderStatus, PaymentStatus } from '~/composables/useOrders'

export const ORDER_STATUSES: OrderStatus[] = ['Confirmed', 'Awaiting Payment', 'Paid', 'Shipped', 'Delivered', 'Cancelled']

const ORDER_STATUS_COLORS: Record<OrderStatus, BadgeProps['color']> = {
  'Confirmed': 'neutral',
  'Awaiting Payment': 'warning',
  'Paid': 'success',
  'Shipped': 'info',
  'Delivered': 'success',
  'Cancelled': 'error'
}

export function orderStatusColor(status: OrderStatus): BadgeProps['color'] {
  return ORDER_STATUS_COLORS[status] ?? 'neutral'
}

export function paymentStatusColor(status: PaymentStatus): BadgeProps['color'] {
  return status === 'Paid' ? 'success' : 'warning'
}
