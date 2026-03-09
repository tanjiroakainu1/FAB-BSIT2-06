import { useState, useMemo } from 'react'
import { PageContainer, OrderDetailsModal } from '@shared/components'
import { useAppData } from '@shared/context'
import type { Order } from '@shared/types'

export default function DeliveryHistory() {
  const { orders, menuItems } = useAppData()
  const [search, setSearch] = useState('')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  const historyOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.deliveryStatus === 'delivered' || o.deliveryStatus === 'picked_up'
      ),
    [orders]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return historyOrders
    return historyOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(q)) ||
        (o.contactNumber && o.contactNumber.toLowerCase().includes(q))
    )
  }, [historyOrders, search])

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Delivery history</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        Orders that have been delivered or picked up.
      </p>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="history-search" className="sr-only">Search orders</label>
        <input
          id="history-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, address, or contact..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl">
        {filtered.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-diamond-muted text-sm sm:text-base">
            {historyOrders.length === 0 ? 'No delivery history yet.' : 'No orders match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full divide-y divide-diamond-border">
              <thead className="bg-diamond-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Address / Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-diamond-border bg-diamond-card">
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-mono text-sm text-diamond">{order.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-diamond text-sm">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-diamond-muted">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-diamond-muted max-w-[200px]">
                      {order.deliveryAddress && <div className="truncate">{order.deliveryAddress}</div>}
                      {order.contactNumber && <div className="text-xs">{order.contactNumber}</div>}
                      {!order.deliveryAddress && !order.contactNumber && '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-diamond-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {order.deliveryStatus === 'picked_up' ? 'Picked up' : 'Delivered'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDetailsOrder(order)}
                        className="rounded bg-crimson/10 px-2.5 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/20"
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
