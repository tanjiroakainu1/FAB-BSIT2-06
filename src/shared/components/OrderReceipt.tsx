import type { Order } from '@shared/types'
import { formatPrice } from '@shared/utils'

const STORE_NAME = 'FOOD ORDERING HERMANAS'
const WIDTH_CHARS = 32

function line(char: string = '-') {
  return char.repeat(WIDTH_CHARS)
}

interface OrderReceiptProps {
  order: Order
  /** Optional: receipt printed/generated at (defaults to doneAt or createdAt) */
  generatedAt?: string
  className?: string
  /** If true, optimized for print (e.g. no background from parent) */
  forPrint?: boolean
}

/** 7/11-style thermal receipt for an order. Use with Print button or window.print() on the receipt container. */
export function OrderReceipt({ order, generatedAt, className = '', forPrint }: OrderReceiptProps) {
  const date = generatedAt || order.doneAt || order.createdAt
  const location =
    order.deliveryOption === 'pickup'
      ? 'PICKUP'
      : (order.deliveryAddress || 'Delivery address not set')

  const itemLines = order.items.map((item) => {
    const lineTotal = item.price * item.quantity
    const namePart = item.name.length > 20 ? item.name.slice(0, 19) + '…' : item.name
    return { name: namePart, qty: item.quantity, price: item.price, total: lineTotal }
  })

  return (
    <div
      className={`receipt-print-area bg-white text-black font-mono text-sm antialiased ${className}`}
      style={{ maxWidth: `${WIDTH_CHARS * 0.6}rem`, margin: forPrint ? 0 : '0 auto' }}
    >
      <div className="p-4 sm:p-6 print:p-6">
        <div className="text-center whitespace-pre leading-tight">
          <div className="font-bold text-base mb-1">{STORE_NAME}</div>
          <div className="text-xs">{line('=')}</div>
          <div className="text-xs mt-1">ORDER # {order.id.slice(0, 8).toUpperCase()}</div>
          <div className="text-xs">DATE: {date ? new Date(date).toLocaleString() : '—'}</div>
          <div className="text-xs">{line('-')}</div>
          <div className="text-left text-xs mt-1">
            <div>Customer: {order.customerName}</div>
            {order.contactNumber && <div>Contact: {order.contactNumber}</div>}
          </div>
          <div className="text-xs">{line('-')}</div>
          {itemLines.map((item, i) => (
            <div key={i} className="text-left text-xs flex justify-between gap-2">
              <span className="flex-1 min-w-0">{item.name} x{item.qty}</span>
              <span className="shrink-0">{formatPrice(item.total)}</span>
            </div>
          ))}
          <div className="text-xs">{line('-')}</div>
          <div className="text-right text-xs font-semibold">TOTAL: {formatPrice(order.total)}</div>
          <div className="text-xs">Payment: {order.paymentMethod?.toUpperCase() ?? 'CASH'}</div>
          <div className="text-xs">{line('-')}</div>
          <div className="text-left text-xs">
            <div className="font-semibold">Location:</div>
            <div className="break-words">{location}</div>
          </div>
          {order.eventType && (
            <div className="text-left text-xs mt-1">Event: {order.eventType}</div>
          )}
          <div className="text-xs mt-2">{line('=')}</div>
          <div className="text-center text-xs mt-2">Thank you for your order!</div>
        </div>
      </div>
    </div>
  )
}
