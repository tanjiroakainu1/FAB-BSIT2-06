import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAuth, useAppData, useCart } from '@shared/context'
import type { PaymentMethod, DeliveryOption } from '@shared/types'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addOrder } = useAppData()
  const { items, total, clearCart } = useCart()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [eventType, setEventType] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('delivery')
  const [placed, setPlaced] = useState(false)

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
        <ul className="divide-y divide-diamond-border">
          {items.map((item) => (
            <li key={item.menuItemId} className="py-2 text-diamond">
              {item.name} × {item.quantity} — {formatPrice(item.price * item.quantity)}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-medium text-diamond">
          Total: <span className="text-crimson">{formatPrice(total)}</span>
        </p>

        <form onSubmit={handlePlaceOrder} className="mt-6 space-y-6">
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
