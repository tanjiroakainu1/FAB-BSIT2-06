import { Link } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useCart, useAppData } from '@shared/context'
import type { OrderItem } from '@shared/types'

const ADDON_NOTE = 'Add-on'

function CartItemRow({
  item,
  imageUrl,
  updateQuantity,
  removeItem,
}: {
  item: OrderItem
  imageUrl: string | undefined
  updateQuantity: (menuItemId: string, qty: number, traySize?: 'half' | 'full', notes?: string) => void
  removeItem: (menuItemId: string, traySize?: 'half' | 'full', notes?: string) => void
}) {
  const lineKey = `${item.menuItemId}-${item.traySize ?? 'full'}-${item.notes ?? ''}`
  const isAddon = item.notes === ADDON_NOTE
  return (
    <li
      key={lineKey}
      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-diamond-border bg-diamond-surface">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-diamond-muted text-xs">No image</div>
          )}
        </div>
        <div className="min-w-0">
          <span className="font-medium text-diamond">{item.name}</span>
          {(item.traySize === 'half' || (item.notes && !isAddon)) && (
            <span className="ml-2 text-xs text-diamond-muted">
              {item.traySize === 'half' && 'Half tray'}
              {item.traySize === 'half' && item.notes && !isAddon ? ' · ' : ''}
              {item.notes && !isAddon && `Note: ${item.notes}`}
            </span>
          )}
          {isAddon && <span className="ml-2 text-xs text-crimson font-medium">Add-on</span>}
          <span className="block mt-0.5 text-diamond-muted text-sm">{formatPrice(item.price)} each</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:pl-2">
        <div className="flex items-center rounded border border-diamond-border overflow-hidden">
          <button
            type="button"
            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1, item.traySize, item.notes)}
            className="rounded-none border-r border-diamond-border px-3 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-0.5 text-diamond-muted hover:bg-diamond-surface touch-manipulation"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 sm:w-8 text-center text-diamond text-sm py-2 sm:py-0">{item.quantity}</span>
          <button
            type="button"
            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1, item.traySize, item.notes)}
            className="rounded-none border-l border-diamond-border px-3 py-2 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-0.5 text-diamond-muted hover:bg-diamond-surface touch-manipulation"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.menuItemId, item.traySize, item.notes)}
          className="min-h-[44px] px-3 py-2 sm:min-h-0 sm:py-0 sm:ml-2 text-crimson hover:text-crimson-light touch-manipulation"
          aria-label="Remove"
        >
          Remove
        </button>
      </div>
    </li>
  )
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const { menuItems } = useAppData()

  const getImageUrl = (menuItemId: string) => menuItems.find((m) => m.id === menuItemId)?.imageUrl

  const mainItems = items.filter((i) => i.notes !== ADDON_NOTE)
  const addOnItems = items.filter((i) => i.notes === ADDON_NOTE)

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

      <div className="mt-6 space-y-6">
        {/* Main items */}
        <div className="card-diamond overflow-hidden rounded-lg">
          <div className="border-b border-diamond-border bg-diamond-surface px-4 py-2.5">
            <h2 className="text-sm font-semibold text-diamond">Main items</h2>
            <p className="text-xs text-diamond-muted">Products added from the menu</p>
          </div>
          {mainItems.length === 0 ? (
            <p className="px-4 py-4 text-sm text-diamond-muted">No main items.</p>
          ) : (
            <ul className="divide-y divide-diamond-border">
              {mainItems.map((item) => (
                <CartItemRow
                  key={`${item.menuItemId}-${item.traySize ?? 'full'}-${item.notes ?? ''}`}
                  item={item}
                  imageUrl={getImageUrl(item.menuItemId)}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Add-ons (separate section) */}
        {addOnItems.length > 0 && (
          <div className="card-diamond overflow-hidden rounded-lg">
            <div className="border-b border-diamond-border bg-diamond-surface px-4 py-2.5">
              <h2 className="text-sm font-semibold text-diamond">Add-ons</h2>
              <p className="text-xs text-diamond-muted">Extra items added with your order</p>
            </div>
            <ul className="divide-y divide-diamond-border">
              {addOnItems.map((item) => (
                <CartItemRow
                  key={`${item.menuItemId}-${item.traySize ?? 'full'}-${item.notes ?? ''}`}
                  item={item}
                  imageUrl={getImageUrl(item.menuItemId)}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-diamond mt-6 flex items-center justify-between rounded-lg border border-diamond-border px-4 py-3">
        <span className="font-medium text-diamond">Total</span>
        <span className="text-lg font-semibold text-crimson">{formatPrice(total)}</span>
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
