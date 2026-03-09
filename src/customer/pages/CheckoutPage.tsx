import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAuth, useAppData, useCart } from '@shared/context'
import type { PaymentMethod, DeliveryOption } from '@shared/types'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addOrder, menuItems } = useAppData()
  const { items, total, clearCart } = useCart()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [eventType, setEventType] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('delivery')
  const [orderNotes, setOrderNotes] = useState('')
  const [gcashMobileNumber, setGcashMobileNumber] = useState('')
  const [needByDate, setNeedByDate] = useState('')
  const [needByTime, setNeedByTime] = useState('')
  const [placed, setPlaced] = useState(false)

  const getImageUrl = (menuItemId: string) => menuItems.find((m) => m.id === menuItemId)?.imageUrl

  const isCustomer = user?.type === 'customer'

  if (items.length === 0 && !placed) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-diamond">Checkout</h1>
        <p className="mt-2 text-diamond-muted">Your cart is empty.</p>
        <Link
          to="/menu"
          className="mt-4 inline-block text-crimson hover:text-crimson-light"
        >
          Browse menu
        </Link>
      </PageContainer>
    )
  }

  if (!isCustomer && !placed) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-diamond">Checkout</h1>
        <p className="mt-2 text-diamond-muted">Please log in or register to place an order.</p>
        <div className="mt-4 flex gap-4">
          <Link
            to="/login"
            className="rounded bg-crimson px-4 py-2 font-medium text-white hover:bg-crimson-light"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded border border-diamond-border px-4 py-2 text-diamond-muted hover:bg-diamond-surface"
          >
            Register
          </Link>
        </div>
      </PageContainer>
    )
  }

  if (placed) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-diamond">Order placed</h1>
        <p className="mt-2 text-diamond-muted">Thank you. Your order has been submitted.</p>
        <Link
          to="/menu"
          className="mt-4 inline-block rounded bg-crimson px-4 py-2 font-medium text-white hover:bg-crimson-light"
        >
          Back to menu
        </Link>
      </PageContainer>
    )
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCustomer || user.type !== 'customer') return
    const contact = contactNumber.trim()
    if (!contact) return
    addOrder({
      items,
      total,
      status: 'pending',
      customerName: user.name,
      customerEmail: user.email,
      paymentMethod,
      paymentStatus: 'pending',
      deliveryOption,
      deliveryStatus: 'pending',
      deliveryAddress: deliveryAddress.trim() || undefined,
      eventType: eventType.trim() || undefined,
      contactNumber: contact,
      orderNotes: orderNotes.trim() || undefined,
      gcashMobileNumber: paymentMethod === 'gcash' ? gcashMobileNumber.trim() || undefined : undefined,
      needByDate: needByDate.trim() || undefined,
      needByTime: needByTime.trim() || undefined,
    })
    clearCart()
    setPlaced(true)
    navigate('/checkout')
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Checkout</h1>
      <p className="mt-2 text-diamond-muted">Complete your order.</p>

      <div className="card-diamond mt-6 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-diamond-muted mb-3">Order summary</h2>
        <ul className="divide-y divide-diamond-border">
          {items.map((item) => (
            <li
              key={`${item.menuItemId}-${item.traySize ?? 'full'}-${item.notes ?? ''}`}
              className="flex items-center gap-3 py-3 first:pt-0"
            >
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-diamond-border bg-diamond-surface">
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
                <span className="font-medium text-diamond">{item.name}</span>
                {item.traySize === 'half' && <span className="ml-1.5 text-xs text-diamond-muted">(half tray)</span>}
                {item.notes && <span className="ml-1.5 text-xs text-diamond-muted">— {item.notes}</span>}
                <p className="text-sm text-diamond-muted mt-0.5">
                  {formatPrice(item.price)} each × {item.quantity} = {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 pt-3 border-t border-diamond-border font-medium text-diamond">
          Total: <span className="text-crimson">{formatPrice(total)}</span>
        </p>

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-6">
          <div className="rounded-lg border border-diamond-border bg-diamond-surface p-4">
            <h3 className="text-sm font-semibold text-diamond">In need of this order</h3>
            <p className="text-xs text-diamond-muted mt-0.5">When do you need this order? (date and time)</p>
            <div className="mt-3 flex flex-wrap gap-4">
              <div className="min-w-[140px]">
                <label htmlFor="needByDate" className="block text-xs font-medium text-diamond-muted">Date</label>
                <input
                  id="needByDate"
                  type="date"
                  value={needByDate}
                  onChange={(e) => setNeedByDate(e.target.value)}
                  className="mt-1 w-full rounded border border-diamond-border bg-diamond-card px-3 py-2 text-diamond"
                />
              </div>
              <div className="min-w-[120px]">
                <label htmlFor="needByTime" className="block text-xs font-medium text-diamond-muted">Time</label>
                <input
                  id="needByTime"
                  type="time"
                  value={needByTime}
                  onChange={(e) => setNeedByTime(e.target.value)}
                  className="mt-1 w-full rounded border border-diamond-border bg-diamond-card px-3 py-2 text-diamond"
                />
              </div>
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-diamond-muted">Payment method</span>
            <div className="mt-2 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="text-crimson focus:ring-crimson"
                />
                <span>Cash</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="gcash"
                  checked={paymentMethod === 'gcash'}
                  onChange={() => setPaymentMethod('gcash')}
                  className="text-crimson focus:ring-crimson"
                />
                <span>GCash</span>
              </label>
            </div>
            {paymentMethod === 'gcash' && (
              <div className="mt-3 rounded-lg border border-crimson/30 bg-crimson/5 p-4">
                <p className="text-sm font-medium text-diamond">Pay to GCash number</p>
                <p className="mt-1 font-mono text-base text-crimson font-semibold">09533852423</p>
                <p className="mt-2 text-xs text-diamond-muted">Enter your GCash-registered mobile number below.</p>
                <label htmlFor="gcashMobileNumber" className="mt-3 block text-sm font-medium text-diamond-muted">
                  Your GCash number
                </label>
                <input
                  id="gcashMobileNumber"
                  type="tel"
                  value={gcashMobileNumber}
                  onChange={(e) => setGcashMobileNumber(e.target.value)}
                  placeholder="e.g. 09533852423"
                  className="mt-1 w-full sm:max-w-xs rounded border border-diamond-border bg-diamond-surface px-3 py-2.5 text-diamond min-h-[44px] focus:border-crimson focus:ring-2 focus:ring-crimson/20 focus:outline-none"
                />
              </div>
            )}
          </div>
          <div>
            <label htmlFor="orderNotes" className="block text-sm font-medium text-diamond-muted">
              Order notes (add-ons, special requests)
            </label>
            <textarea
              id="orderNotes"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. add-on packages, delivery instructions"
              rows={2}
              className="mt-1 w-full rounded border border-diamond-border bg-diamond-surface px-3 py-2 text-diamond min-h-[60px]"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-diamond-muted">Delivery option</span>
            <div className="mt-2 flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="delivery"
                  checked={deliveryOption === 'delivery'}
                  onChange={() => setDeliveryOption('delivery')}
                  className="text-crimson focus:ring-crimson"
                />
                <span>Delivery</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="pickup"
                  checked={deliveryOption === 'pickup'}
                  onChange={() => setDeliveryOption('pickup')}
                  className="text-crimson focus:ring-crimson"
                />
                <span>Pickup</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-diamond-muted">
              Contact number <span className="text-crimson">*</span>
            </label>
            <input
              id="contactNumber"
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. 09XX XXX XXXX"
              className="mt-1 w-full sm:max-w-xs rounded border border-diamond-border bg-diamond-surface px-3 py-3 sm:py-2 text-diamond min-h-[48px] sm:min-h-0"
              required
            />
          </div>
          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-diamond-muted">
              Delivery address
            </label>
            <textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Street, barangay, city"
              rows={3}
              className="mt-1 w-full rounded border border-diamond-border bg-diamond-surface px-3 py-3 sm:py-2 text-diamond min-h-[80px]"
            />
          </div>
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-diamond-muted">
              Event type
            </label>
            <input
              id="eventType"
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g. Birthday, Meeting, Party"
              className="mt-1 w-full sm:max-w-xs rounded border border-diamond-border bg-diamond-surface px-3 py-3 sm:py-2 text-diamond min-h-[48px] sm:min-h-0"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto rounded bg-crimson px-6 py-3 min-h-[48px] sm:py-2 sm:min-h-0 font-medium text-white hover:bg-crimson-light touch-manipulation"
          >
            Place order
          </button>
        </form>
      </div>
    </PageContainer>
  )
}
