import { useState, useMemo } from 'react'
import { PageContainer } from '@shared/components'
import { useAppData } from '@shared/context'
import type { Order } from '@shared/types'
import { formatPrice } from '@shared/utils'

export default function AdminPaymentReceipts() {
  const { orders } = useAppData()
  const [search, setSearch] = useState('')
  const [previewOrder, setPreviewOrder] = useState<Order | null>(null)

  const ordersWithReceipts = useMemo(
    () => orders.filter((o) => o.paymentReceiptDataUrl),
    [orders]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return ordersWithReceipts
    return ordersWithReceipts.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    )
  }, [ordersWithReceipts, search])

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Payment receipts</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">
        All customer-attached GCash payment receipt photos. Search by Order ID, customer name, or email.
      </p>

      <div className="card-diamond mt-6 rounded-xl p-4 sm:p-5">
        <label htmlFor="receipts-search" className="sr-only">Search by order ID</label>
        <input
          id="receipts-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, name, or email..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search by order ID"
        />
      </div>

      <div className="card-diamond mt-6 overflow-hidden rounded-xl">
        {filtered.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-diamond-muted text-sm sm:text-base">
            {ordersWithReceipts.length === 0 ? 'No payment receipts submitted yet.' : 'No receipts match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full divide-y divide-diamond-border">
              <thead className="bg-diamond-surface">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-diamond-muted">Attachment</th>
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
                    <td className="px-4 py-3 font-medium text-diamond text-sm">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-sm text-diamond-muted">
                      {order.paymentReceiptSubmittedAt ? formatDate(order.paymentReceiptSubmittedAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setPreviewOrder(order)}
                        className="rounded bg-crimson/10 px-2.5 py-1.5 text-xs font-medium text-crimson hover:bg-crimson/20"
                      >
                        View photo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {previewOrder?.paymentReceiptDataUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewOrder(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewOrder.paymentReceiptDataUrl}
              alt="Payment receipt"
              className="max-h-[90vh] max-w-full rounded-lg border-2 border-diamond-border object-contain"
            />
            <button
              type="button"
              onClick={() => setPreviewOrder(null)}
              className="absolute top-2 right-2 rounded bg-black/60 px-3 py-1 text-sm text-white hover:bg-black/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
