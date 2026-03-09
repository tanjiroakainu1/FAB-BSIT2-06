import type { Order, MenuItem } from '@shared/types'
import { formatPrice } from '@shared/utils'

interface OrderDetailsModalProps {
  order: Order | null
  menuItems: MenuItem[]
  onClose: () => void
}

function getImageForItem(menuItems: MenuItem[], menuItemId: string): string | undefined {
  return menuItems.find((m) => m.id === menuItemId)?.imageUrl
}

export function OrderDetailsModal({ order, menuItems, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const formatDate = (iso: string) => new Date(iso).toLocaleString()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      <div
        className="card-diamond w-full max-h-[95vh] sm:max-h-[90vh] sm:max-w-lg overflow-hidden rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-diamond-border bg-gradient-to-r from-crimson-dark/10 to-crimson/10 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h2 id="order-details-title" className="text-base sm:text-lg font-semibold text-diamond truncate min-w-0">
            Order {order.id.slice(0, 8)}…
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 -m-2 text-diamond-muted hover:bg-diamond-surface hover:text-diamond focus:outline-none focus:ring-2 focus:ring-crimson min-w-[44px] min-h-[44px] flex items-center justify-center sm:min-w-0 sm:min-h-0 sm:p-1.5"
            aria-label="Close"
          >
            <span className="text-2xl sm:text-xl leading-none">×</span>
          </button>
        </div>
        <div className="overflow-y-auto overflow-x-hidden flex-1 min-h-0 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-diamond-muted">Customer</span>
              <p className="font-medium text-diamond">{order.customerName}</p>
              <p className="text-diamond-muted">{order.customerEmail}</p>
              {order.contactNumber && (
                <p className="text-diamond-muted">{order.contactNumber}</p>
              )}
            </div>
            <div>
              <span className="text-diamond-muted">Date</span>
              <p className="text-diamond">{formatDate(order.createdAt)}</p>
              <span className="text-diamond-muted block mt-1">Total</span>
              <p className="font-semibold text-crimson">{formatPrice(order.total)}</p>
            </div>
            {order.deliveryAddress && (
              <div className="sm:col-span-2">
                <span className="text-diamond-muted">Delivery address</span>
                <p className="text-diamond">{order.deliveryAddress}</p>
              </div>
            )}
            {order.eventType && (
              <div>
                <span className="text-diamond-muted">Event</span>
                <p className="text-diamond">{order.eventType}</p>
              </div>
            )}
            {(order.needByDate || order.needByTime) && (
              <div>
                <span className="text-diamond-muted">In need of this order</span>
                <p className="text-diamond">
                  {order.needByDate && order.needByTime
                    ? `${order.needByDate} at ${order.needByTime}`
                    : order.needByDate || order.needByTime || '—'}
                </p>
              </div>
            )}
            <div>
              <span className="text-diamond-muted">Payment</span>
              <p className="text-diamond capitalize">{order.paymentMethod ?? 'cash'}</p>
              <p className="text-diamond-muted capitalize">{order.paymentStatus ?? 'pending'}</p>
              {order.paymentReference && (
                <p className="text-diamond-muted text-xs mt-0.5">Ref: {order.paymentReference}</p>
              )}
              {order.gcashMobileNumber && (
                <p className="text-diamond-muted text-xs mt-0.5">GCash: {order.gcashMobileNumber}</p>
              )}
            </div>
            {order.orderNotes && (
              <div className="sm:col-span-2">
                <span className="text-diamond-muted">Order notes</span>
                <p className="text-diamond text-sm">{order.orderNotes}</p>
              </div>
            )}
            <div>
              <span className="text-diamond-muted">Delivery</span>
              <p className="text-diamond capitalize">{order.deliveryOption ?? 'delivery'}</p>
              <p className="text-diamond-muted capitalize">{(order.deliveryStatus ?? 'pending').replace('_', ' ')}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-diamond-muted mb-2">Items</h3>
            <ul className="space-y-3">
              {order.items.map((item, idx) => {
                const imageUrl = getImageForItem(menuItems, item.menuItemId)
                return (
                  <li
                    key={`${order.id}-${item.menuItemId}-${idx}`}
                    className="flex gap-3 rounded-lg border border-diamond-border bg-diamond-surface p-3 min-w-0"
                  >
                    <div className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg bg-diamond-border">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-diamond-muted text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-diamond">{item.name}</p>
                      {(item.traySize === 'half' || item.notes) && (
                        <p className="text-xs text-diamond-muted">
                          {item.traySize === 'half' && 'Half tray'}
                          {item.traySize === 'half' && item.notes ? ' · ' : ''}
                          {item.notes && item.notes}
                        </p>
                      )}
                      <p className="text-sm text-diamond-muted">
                        {item.quantity} × {formatPrice(item.price)} = {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
