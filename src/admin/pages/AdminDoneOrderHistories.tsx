import { useState, useMemo } from 'react'
import { PageContainer, OrderDetailsModal, ReceiptModal } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData } from '@shared/context'
import type { Order } from '@shared/types'

export default function AdminDoneOrderHistories() {
  const { orders, menuItems } = useAppData()
  const [search, setSearch] = useState('')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null)

  const doneOrders = useMemo(() => orders.filter((o) => o.doneAt), [orders])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return doneOrders
    return doneOrders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.contactNumber && o.contactNumber.toLowerCase().includes(q))
    )
  }, [doneOrders, search])

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Done order histories</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-emerald-500/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        Orders marked as done from the Orders page. Search by Order ID, name, email, or contact number.
      </p>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="done-search" className="sr-only">Search done orders</label>
        <input
          id="done-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, email, or contact number..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search done orders"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl">
        {filtered.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-diamond-muted text-sm sm:text-base">
            {doneOrders.length === 0 ? 'No done orders yet. Mark orders as done from the Orders page.' : 'No orders match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full divide-y divide-diamond-border">
              <thead className="bg-diamond-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Done at</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Receipt</th>
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
                    <td className="px-4 py-3 text-sm text-diamond-muted">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-emerald-700 font-medium">
                      {order.doneAt ? formatDate(order.doneAt) : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-diamond text-sm">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setReceiptOrder(order)}
                        className="rounded bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                      >
                        Generate receipt
                      </button>
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

      <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
    </PageContainer>
  )
}
