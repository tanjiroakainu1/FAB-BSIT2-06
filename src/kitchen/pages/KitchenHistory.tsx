import { useState, useMemo } from 'react'
import { PageContainer, OrderDetailsModal } from '@shared/components'
import { useAppData } from '@shared/context'
import type { Order } from '@shared/types'

export default function KitchenHistory() {
  const { orders, menuItems } = useAppData()
  const [search, setSearch] = useState('')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  /** Orders where kitchen has approved (kitchen_status = completed). */
  const completedOrders = useMemo(
    () => orders.filter((o) => (o.kitchenStatus ?? 'pending') === 'completed'),
    [orders]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return completedOrders
    return completedOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.contactNumber && o.contactNumber.toLowerCase().includes(q))
    )
  }, [completedOrders, search])

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Kitchen history</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        Orders you have approved (kitchen completed). These are now visible to Delivery.
      </p>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="kitchen-history-search" className="sr-only">Search orders</label>
        <input
          id="kitchen-history-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, or contact..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl -mx-3 sm:mx-0">
        {filtered.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-diamond-muted text-sm sm:text-base">
            {completedOrders.length === 0 ? 'No completed orders yet. Approve orders on the Orders page to see them here.' : 'No orders match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-[640px] sm:min-w-full divide-y divide-diamond-border">
              <thead className="bg-gradient-to-r from-diamond-surface to-diamond-card">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Order ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Customer</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Date</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Items</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Kitchen</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-diamond-muted whitespace-nowrap">Details</th>
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
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-diamond-muted max-w-[140px] min-w-0">
                      <span className="line-clamp-2">{order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <span className="inline-flex rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        Completed
                      </span>
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
