import { Link } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useCart } from '@shared/context'

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-diamond">Your cart</h1>
        <p className="mt-2 text-diamond-muted">Your cart is empty.</p>
        <Link
          to="/menu"
          className="mt-4 inline-block rounded bg-crimson px-4 py-2 font-medium text-white hover:bg-crimson-light"
        >
          Browse menu
        </Link>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Your cart</h1>
      <p className="mt-2 text-diamond-muted">Review your order before checkout.</p>

      <div className="card-diamond mt-6 overflow-hidden rounded-lg">
        <ul className="divide-y divide-diamond-border">
          {items.map((item) => (
            <li key={item.menuItemId} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <span className="font-medium text-diamond">{item.name}</span>
                <span className="ml-2 text-diamond-muted">{formatPrice(item.price)} each</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <div className="flex items-center rounded border border-diamond-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="rounded-none border-r border-diamond-border px-3 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-0.5 text-diamond-muted hover:bg-diamond-surface touch-manipulation"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 sm:w-8 text-center text-diamond text-sm py-2 sm:py-0">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="rounded-none border-l border-diamond-border px-3 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-0.5 text-diamond-muted hover:bg-diamond-surface touch-manipulation"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.menuItemId)}
                  className="min-h-[44px] px-3 py-2 sm:min-h-0 sm:py-0 sm:ml-2 text-crimson hover:text-crimson-light touch-manipulation"
                  aria-label="Remove"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-diamond-border px-4 py-3 bg-diamond-surface">
          <span className="font-medium text-diamond">Total</span>
          <span className="text-lg font-semibold text-crimson">{formatPrice(total)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="mt-6 inline-block w-full sm:w-auto text-center rounded bg-crimson px-6 py-3 min-h-[48px] sm:py-2 sm:min-h-0 font-medium text-white hover:bg-crimson-light touch-manipulation"
      >
        Proceed to checkout
      </Link>
    </PageContainer>
  )
}
