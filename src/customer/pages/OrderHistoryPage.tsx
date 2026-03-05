import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAuth, useAppData } from '@shared/context'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function formatLabel(s: string) {
  return s.replace(/_/g, ' ')
}

export default function OrderHistoryPage() {
  const { user } = useAuth()
  const { orders } = useAppData()

  if (user?.type !== 'customer') {
    return null
  }

  const myOrders = orders
    .filter((o) => o.customerEmail.toLowerCase() === user.email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Order history</h1>
      <p className="mt-2 text-diamond-muted">View your orders and their status.</p>

      {myOrders.length === 0 ? (
        <div className="card-diamond mt-6 rounded-lg p-8 text-center text-diamond-muted">
          You have no orders yet.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="card-diamond rounded-lg p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-diamond-border pb-3">
                <div>
                  <span className="font-mono text-sm text-diamond-muted">
                    Order #{order.id.slice(0, 8)}
                  </span>
                  <p className="mt-0.5 text-sm text-diamond-muted">{formatDate(order.createdAt)}</p>
                </div>
                <span className="font-semibold text-crimson">{formatPrice(order.total)}</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
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
              <p className="mt-2 text-xs text-diamond-muted">
                {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
