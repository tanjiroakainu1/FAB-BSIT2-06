import { useState, useMemo } from 'react'
import { PageContainer, OrderDetailsModal } from '@shared/components'
import { useAppData } from '@shared/context'
import type { Order, DeliveryStatus } from '@shared/types'

const DELIVERY_STATUS_OPTIONS: DeliveryStatus[] = [
  'pending',
  'out_for_delivery',
  'delivered',
  'picked_up',
]

export default function DeliveryOrders() {
  const { orders, menuItems, updateOrderDeliveryStatus } = useAppData()
  const [search, setSearch] = useState('')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          (o.deliveryStatus ?? 'pending') === 'pending' ||
          o.deliveryStatus === 'out_for_delivery'
      ),
    [orders]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return activeOrders
    return activeOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(q)) ||
        (o.contactNumber && o.contactNumber.toLowerCase().includes(q))
    )
  }, [activeOrders, search])

  const handleDeliveryStatusChange = (orderId: string, status: DeliveryStatus) => {
    updateOrderDeliveryStatus(orderId, status)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString()
  }

  const handleMarkDone = (order: Order) => {
    const status = order.deliveryOption === 'pickup' ? 'picked_up' : 'delivered'
    updateOrderDeliveryStatus(order.id, status)
  }

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Delivery</h1>
            <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
          </div>
          <p className="mt-2 text-diamond-muted">Update delivery status for each order.</p>
        </div>
        <div className="card-diamond rounded-xl px-4 py-2 text-center">
          <span className="text-xs font-medium text-diamond-muted">Active</span>
          <p className="text-xl font-bold text-crimson">{activeOrders.length}</p>
        </div>
      </div>

      <div className="card-diamond rounded-xl p-4 sm:p-5">
        <label htmlFor="delivery-search" className="sr-only">
          Search orders
        </label>
        <input
          id="delivery-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, address, or contact..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search orders"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl -mx-3 sm:mx-0">
        {filtered.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-diamond-muted text-sm sm:text-base">
            {activeOrders.length === 0 ? 'No active deliveries. Mark orders as done to move them to History.' : 'No orders match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-[640px] sm:min-w-full divide-y divide-diamond-border">
              <thead className="bg-gradient-to-r from-diamond-surface to-diamond-card">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Order ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Customer</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Address / Contact</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Type</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Details</th>
                  <th className="px-2 sm:px-4 py-3 text-right text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Done</th>
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
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted max-w-[140px] sm:max-w-[200px] min-w-0">
                      {order.deliveryAddress && (
                        <div className="truncate" title={order.deliveryAddress}>{order.deliveryAddress}</div>
                      )}
                      {order.contactNumber && (
                        <div className="text-xs text-diamond-muted truncate">{order.contactNumber}</div>
                      )}
                      {!order.deliveryAddress && !order.contactNumber && '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted whitespace-nowrap">{formatDate(order.createdAt)}</td>
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
                      <button
                        type="button"
                        onClick={() => setDetailsOrder(order)}
                        className="rounded bg-crimson/10 px-2.5 py-2 sm:py-1 text-xs font-medium text-crimson hover:bg-crimson/20 min-h-[44px] sm:min-h-0 touch-manipulation"
                      >
                        View details
                      </button>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleMarkDone(order)}
                        className="rounded bg-green-600 px-3 py-2 sm:py-1.5 text-xs font-medium text-white hover:bg-green-700 min-h-[44px] sm:min-h-0 touch-manipulation"
                      >
                        Done
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
