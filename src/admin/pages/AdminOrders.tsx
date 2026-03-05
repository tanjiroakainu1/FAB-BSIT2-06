import { useState, useMemo } from 'react'
import { PageContainer, OrderDetailsModal } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData } from '@shared/context'
import type { Order, OrderStatus, PaymentStatus, DeliveryStatus, CalledStatus, KitchenStatus } from '@shared/types'

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled',
]

const PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['pending', 'paid']

const DELIVERY_STATUS_OPTIONS: DeliveryStatus[] = [
  'pending',
  'out_for_delivery',
  'delivered',
  'picked_up',
]

const CALLED_STATUS_OPTIONS: CalledStatus[] = ['pending', 'completed']
const KITCHEN_STATUS_OPTIONS: KitchenStatus[] = ['pending', 'completed']

export default function AdminOrders() {
  const {
    orders,
    menuItems,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderDeliveryStatus,
    updateOrderCalledStatus,
    updateOrderKitchenStatus,
  } = useAppData()
  const [search, setSearch] = useState('')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.contactNumber && o.contactNumber.toLowerCase().includes(q))
    )
  }, [orders, search])

  const handleOrderStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
  }

  const handlePaymentStatusChange = (orderId: string, status: PaymentStatus) => {
    updateOrderPaymentStatus(orderId, status)
  }

  const handleDeliveryStatusChange = (orderId: string, status: DeliveryStatus) => {
    updateOrderDeliveryStatus(orderId, status)
  }

  const handleCalledStatusChange = (orderId: string, status: CalledStatus) => {
    updateOrderCalledStatus(orderId, status)
  }

  const handleKitchenStatusChange = (orderId: string, status: KitchenStatus) => {
    updateOrderKitchenStatus(orderId, status)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString()
  }

  const pendingOrders = orders.filter((o) =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  ).length

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Orders</h1>
            <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
          </div>
          <p className="mt-2 text-diamond-muted">View and manage customer orders.</p>
        </div>
        <div className="card-diamond rounded-xl px-4 py-2 text-center">
          <span className="text-xs font-medium text-diamond-muted">Pending</span>
          <p className="text-xl font-bold text-crimson">{pendingOrders}</p>
        </div>
      </div>

      <div className="card-diamond rounded-xl p-4 sm:p-5">
        <label htmlFor="order-search" className="sr-only">
          Search orders
        </label>
        <input
          id="order-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, email, or contact number..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search orders"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl -mx-3 sm:mx-0">
        {filtered.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-diamond-muted text-sm sm:text-base">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-[800px] sm:min-w-full divide-y divide-diamond-border">
              <thead className="bg-gradient-to-r from-diamond-surface to-diamond-card">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted">Order ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Customer</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Contact</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Address / Event</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Total</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Order</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Payment</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Payment status</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Delivery</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Delivery status</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Called</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Kitchen</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted">Items</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-diamond-border bg-diamond-card">
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td className="px-2 sm:px-4 py-3 font-mono text-xs sm:text-sm text-diamond">{order.id.slice(0, 8)}…</td>
                    <td className="px-2 sm:px-4 py-3 text-diamond text-xs sm:text-sm min-w-0">
                      <div className="truncate">{order.customerName}</div>
                      <div className="text-xs text-diamond-muted truncate">{order.customerEmail}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond font-medium whitespace-nowrap">
                      {order.contactNumber ?? '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted max-w-[140px] sm:max-w-[180px] min-w-0">
                      {order.deliveryAddress && (
                        <div className="truncate" title={order.deliveryAddress}>{order.deliveryAddress}</div>
                      )}
                      {order.eventType && (
                        <div className="text-xs text-diamond-muted">{order.eventType}</div>
                      )}
                      {!order.deliveryAddress && !order.eventType && '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-2 sm:px-4 py-3 font-medium text-diamond text-xs sm:text-sm">{formatPrice(order.total)}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value as OrderStatus)}
                        className="rounded border border-diamond-border px-2 py-1.5 sm:py-1 text-xs sm:text-sm text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson bg-diamond-surface min-h-[44px] sm:min-h-0 w-full min-w-0 max-w-[120px]"
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted capitalize">{order.paymentMethod ?? 'cash'}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <select
                        value={order.paymentStatus ?? 'pending'}
                        onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)}
                        className="rounded border border-diamond-border px-2 py-1.5 sm:py-1 text-xs sm:text-sm text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson bg-diamond-surface min-h-[44px] sm:min-h-0 w-full min-w-0 max-w-[90px]"
                      >
                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted capitalize">{order.deliveryOption ?? 'delivery'}</td>
                    <td className="px-2 sm:px-4 py-3">
                      <select
                        value={order.deliveryStatus ?? 'pending'}
                        onChange={(e) => handleDeliveryStatusChange(order.id, e.target.value as DeliveryStatus)}
                        className="rounded border border-diamond-border px-2 py-1.5 sm:py-1 text-xs sm:text-sm text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson bg-diamond-surface min-h-[44px] sm:min-h-0 w-full min-w-0 max-w-[130px]"
                      >
                        {DELIVERY_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <select
                        value={order.calledStatus ?? 'pending'}
                        onChange={(e) => handleCalledStatusChange(order.id, e.target.value as CalledStatus)}
                        className="rounded border border-diamond-border px-2 py-1.5 sm:py-1 text-xs sm:text-sm text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson bg-diamond-surface min-h-[44px] sm:min-h-0 w-full min-w-0 max-w-[100px]"
                        title="Order called out to customer (admin only)"
                      >
                        {CALLED_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <select
                        value={order.kitchenStatus ?? 'pending'}
                        onChange={(e) => handleKitchenStatusChange(order.id, e.target.value as KitchenStatus)}
                        className="rounded border border-diamond-border px-2 py-1.5 sm:py-1 text-xs sm:text-sm text-diamond focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson bg-diamond-surface min-h-[44px] sm:min-h-0 w-full min-w-0 max-w-[100px]"
                        title="Kitchen status (admin only)"
                      >
                        {KITCHEN_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted max-w-[160px] min-w-0">
                      <span className="line-clamp-2">{order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDetailsOrder(order)}
                        className="rounded bg-crimson/10 px-2.5 py-2 sm:py-1 text-xs font-medium text-crimson hover:bg-crimson/20 focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-1 min-h-[44px] sm:min-h-0 touch-manipulation"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <OrderDetailsModal
        order={detailsOrder}
        menuItems={menuItems}
        onClose={() => setDetailsOrder(null)}
      />
    </PageContainer>
  )
}
