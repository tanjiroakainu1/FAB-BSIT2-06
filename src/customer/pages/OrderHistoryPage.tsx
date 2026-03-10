import { useState, useMemo } from 'react'
import { PageContainer, OrderDetailsModal, ReceiptModal } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAuth, useAppData } from '@shared/context'
import type { Order, OrderStatus } from '@shared/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function formatLabel(s: string) {
  return s.replace(/_/g, ' ')
}

const ORDER_STATUS_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function OrderHistoryPage() {
  const { user } = useAuth()
  const { orders, menuItems, paymentInstruction, updateOrderReceipt } = useAppData()
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set())
  const [showPaymentInstructionModal, setShowPaymentInstructionModal] = useState(false)

  const toggleOrder = (orderId: string) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev)
      if (next.has(orderId)) next.delete(orderId)
      else next.add(orderId)
      return next
    })
  }

  const getImageUrl = (menuItemId: string) => menuItems.find((m) => m.id === menuItemId)?.imageUrl

  if (user?.type !== 'customer') {
    return null
  }

  const myOrders = useMemo(
    () =>
      orders
        .filter((o) => o.customerEmail.toLowerCase() === user.email.toLowerCase())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders, user.email]
  )

  const filteredOrders = useMemo(() => {
    let list = myOrders
    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter)
    }
    const q = search.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        formatDate(o.createdAt).toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q) ||
        (o.paymentMethod && o.paymentMethod.toLowerCase().includes(q)) ||
        (o.paymentStatus && o.paymentStatus.toLowerCase().includes(q)) ||
        (o.deliveryOption && o.deliveryOption.toLowerCase().includes(q)) ||
        (o.deliveryStatus && o.deliveryStatus.toLowerCase().includes(q)) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
    )
  }, [myOrders, statusFilter, search])

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Order history</h1>
      <p className="mt-2 text-diamond-muted">View your orders and their status.</p>

      {myOrders.length > 0 && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          <label htmlFor="orders-search" className="sr-only">Search orders</label>
          <input
            id="orders-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, date, status, or item name..."
            className="flex-1 min-w-0 rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted transition focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
            aria-label="Search orders"
          />
          <label htmlFor="orders-status" className="sr-only">Filter by status</label>
          <select
            id="orders-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20 min-w-[160px]"
            aria-label="Filter by order status"
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {myOrders.length === 0 ? (
        <div className="card-diamond mt-6 rounded-lg p-8 text-center text-diamond-muted">
          You have no orders yet.
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card-diamond mt-6 rounded-lg p-8 text-center text-diamond-muted">
          No orders match your search or filter. Try a different search or select &quot;All orders&quot;.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderIds.has(order.id)
            return (
            <div
              key={order.id}
              className="card-diamond rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleOrder(order.id)}
                className="w-full flex flex-wrap items-center justify-between gap-2 p-4 text-left hover:bg-diamond-surface/50 transition"
                aria-expanded={isExpanded}
                aria-controls={`order-details-${order.id}`}
                id={`order-header-${order.id}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="shrink-0 text-diamond-muted transition-transform"
                    aria-hidden
                  >
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  <div>
                    <span className="font-mono text-sm text-diamond-muted">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <p className="mt-0.5 text-sm text-diamond-muted">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-crimson">{formatPrice(order.total)}</span>
                  <span className="text-xs capitalize text-diamond-muted">· {formatLabel(order.status)}</span>
                </div>
              </button>
              <div
                id={`order-details-${order.id}`}
                role="region"
                aria-labelledby={`order-header-${order.id}`}
                className={isExpanded ? 'border-t border-diamond-border' : 'hidden'}
              >
                <div className="p-4 pt-3">
                  <div className="flex flex-wrap items-center justify-end gap-2 mb-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setReceiptOrder(order) }}
                      className="rounded-lg border border-emerald-600/50 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 transition"
                    >
                      Receipt
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setDetailsOrder(order) }}
                      className="rounded-lg border border-crimson/50 bg-crimson/10 px-3 py-2 text-sm font-medium text-crimson hover:bg-crimson/20 transition"
                    >
                      View details
                    </button>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="text-diamond-muted">Order status</span>
                  <p className="font-medium capitalize text-diamond">{formatLabel(order.status)}</p>
                </div>
                <div>
                  <span className="text-diamond-muted">Payment method</span>
                  <p className="font-medium capitalize text-diamond">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-diamond-muted">Payment status</span>
                  <p className="font-medium capitalize text-diamond">{formatLabel(order.paymentStatus ?? 'pending')}</p>
                </div>
                <div>
                  <span className="text-diamond-muted">Delivery</span>
                  <p className="font-medium capitalize text-diamond">
                    {formatLabel(order.deliveryOption ?? 'delivery')} · {formatLabel(order.deliveryStatus ?? 'pending')}
                  </p>
                </div>
                  </div>
                  {order.paymentMethod === 'gcash' && (
                    <div className="mt-3 border-t border-diamond-border pt-3">
                      <p className="text-xs font-medium text-diamond-muted mb-2">GCash payment</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setShowPaymentInstructionModal(true) }}
                          className="rounded-lg border border-crimson/50 bg-crimson/10 px-3 py-2 text-sm font-medium text-crimson hover:bg-crimson/20 transition"
                        >
                          View payment instruction
                        </button>
                        {order.paymentReceiptDataUrl ? (
                          <span className="inline-flex items-center gap-1.5 rounded bg-green-100 px-2.5 py-1.5 text-xs font-medium text-green-800">
                            <span aria-hidden>✓</span> Receipt submitted
                          </span>
                        ) : (
                          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-diamond-border bg-diamond-surface px-3 py-2 text-sm font-medium text-diamond hover:bg-diamond-card transition">
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file || !file.type.startsWith('image/')) return
                                const reader = new FileReader()
                                reader.onload = () => updateOrderReceipt(order.id, reader.result as string)
                                reader.readAsDataURL(file)
                                e.target.value = ''
                              }}
                            />
                            Choose file (submit receipt)
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                  {(order.contactNumber || order.deliveryAddress || order.eventType) && (
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  {order.contactNumber && (
                    <span className="text-diamond-muted">Contact: <strong>{order.contactNumber}</strong></span>
                  )}
                  {order.deliveryAddress && (
                    <span className="text-diamond-muted">Address: {order.deliveryAddress}</span>
                  )}
                  {order.eventType && (
                    <span className="text-diamond-muted">Event: {order.eventType}</span>
                  )}
                </div>
                  )}
                  <div className="mt-3 border-t border-diamond-border pt-3">
                    <p className="text-xs font-medium text-diamond-muted mb-2">Items</p>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li
                      key={`${item.menuItemId}-${item.traySize ?? 'full'}-${item.notes ?? ''}-${idx}`}
                      className="flex items-center gap-3 rounded-lg border border-diamond-border bg-diamond-surface p-2"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-diamond-border bg-diamond-card">
                        {getImageUrl(item.menuItemId) ? (
                          <img
                            src={getImageUrl(item.menuItemId)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-diamond-muted text-xs">—</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-diamond text-sm">{item.name}</span>
                        {(item.traySize === 'half' || item.notes) && (
                          <span className="ml-1.5 text-xs text-diamond-muted">
                            {item.traySize === 'half' && 'Half tray'}
                            {item.traySize === 'half' && item.notes ? ' · ' : ''}
                            {item.notes && item.notes}
                          </span>
                        )}
                        <p className="text-xs text-diamond-muted mt-0.5">
                          {formatPrice(item.price)} each × {item.quantity}
                        </p>
                      </div>
                    </li>
                  ))}
                  </ul>
                  </div>
                </div>
              </div>
            </div>
          )
          })}
        </div>
      )}

      <OrderDetailsModal
        order={detailsOrder}
        menuItems={menuItems}
        onClose={() => setDetailsOrder(null)}
      />

      <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />

      {showPaymentInstructionModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          role="dialog"
          aria-modal="true"
          aria-label="GCash payment instruction"
          onClick={() => setShowPaymentInstructionModal(false)}
        >
          <div className="relative max-h-[90vh] max-w-2xl" onClick={(e) => e.stopPropagation()}>
            {paymentInstruction ? (
              <>
                <img
                  src={paymentInstruction}
                  alt="How to pay via GCash"
                  className="max-h-[90vh] max-w-full rounded-lg border-2 border-diamond-border object-contain bg-diamond-card"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <a
                    href={paymentInstruction}
                    download="gcash-payment-instruction.png"
                    className="rounded bg-crimson px-3 py-1.5 text-sm font-medium text-white hover:bg-crimson-light"
                  >
                    Save image
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowPaymentInstructionModal(false)}
                    className="rounded bg-black/60 px-3 py-1.5 text-sm text-white hover:bg-black/80"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg border-2 border-diamond-border bg-diamond-card p-8 text-center text-diamond-muted">
                  No payment instruction image set yet. The admin can upload one in Admin → GCash instruction.
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentInstructionModal(false)}
                  className="absolute top-2 right-2 rounded bg-black/60 px-3 py-1.5 text-sm text-white hover:bg-black/80"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  )
}
