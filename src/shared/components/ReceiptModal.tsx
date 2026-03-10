import { useRef } from 'react'
import { OrderReceipt } from './OrderReceipt'
import { downloadReceiptAsImage } from '@shared/utils'
import type { Order } from '@shared/types'

interface ReceiptModalProps {
  order: Order | null
  onClose: () => void
}

export function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  if (!order) return null

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return
    await downloadReceiptAsImage(receiptRef.current, `receipt-order-${order.id.slice(0, 8)}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Order receipt"
      onClick={onClose}
    >
      <div
        className="bg-diamond-card rounded-xl shadow-xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between gap-2 p-3 border-b border-diamond-border bg-diamond-surface rounded-t-xl">
          <h3 className="font-semibold text-diamond">Receipt – Order {order.id.slice(0, 8)}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Print receipt
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              className="rounded bg-crimson px-3 py-1.5 text-sm font-medium text-white hover:bg-crimson-light"
            >
              Download image
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-diamond-border px-3 py-1.5 text-sm font-medium text-diamond hover:bg-diamond-surface"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-4">
          <div ref={receiptRef} className="bg-white">
            <OrderReceipt order={order} />
          </div>
        </div>
      </div>
    </div>
  )
}
