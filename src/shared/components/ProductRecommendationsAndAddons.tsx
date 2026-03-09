import { formatPrice } from '@shared/utils'
import type { MenuItem } from '@shared/types'

interface Category {
  id: string
  name: string
}

interface ProductRecommendationsAndAddonsProps {
  /** Current product (excluded from list). */
  currentItem: MenuItem
  /** All other menu items to show as add-ons (all products in system, excluding current). */
  recommendations: MenuItem[]
  /** Categories for grouping add-ons by same category. */
  categories?: Category[]
  /** Selected add-on IDs and quantity. */
  selectedAddons: Record<string, number>
  onAddonChange: (menuItemId: string, quantity: number) => void
  /** When selectable=false: quantity and optional traySize (for products with halfTrayAvailable). */
  onAddAddonToCart?: (item: MenuItem, quantity: number, traySize?: 'half' | 'full') => void
  /** If true, show as selectable add-ons in modal. If false, show as + buttons below card. */
  selectable?: boolean
}

/**
 * Add-ons: all products in the system (excluding current), grouped by category.
 * Used in product modal (selectable) and below menu cards (add-on buttons).
 */
export function ProductRecommendationsAndAddons({
  currentItem: _currentItem,
  recommendations,
  categories = [],
  selectedAddons,
  onAddonChange,
  onAddAddonToCart,
  selectable = true,
}: ProductRecommendationsAndAddonsProps) {
  if (recommendations.length === 0) return null

  const categoryIds = new Set(categories.map((c) => c.id))
  const byCategory =
    categories.length > 0
      ? [
          ...categories
            .map((cat) => ({
              category: cat,
              items: recommendations.filter((m) => m.categoryId === cat.id),
            }))
            .filter((g) => g.items.length > 0),
          ...(recommendations.some((m) => !categoryIds.has(m.categoryId))
            ? [{ category: { id: '_other', name: 'Other' }, items: recommendations.filter((m) => !categoryIds.has(m.categoryId)) }]
            : []),
        ]
      : [{ category: { id: '', name: 'All products' }, items: recommendations }]

  return (
    <div className="mt-6 pt-4 border-t border-diamond-border">
      <h3 className="text-sm font-semibold text-diamond-muted">
        {selectable ? 'Add-ons — all products' : 'Add-ons — all products'}
      </h3>
      <p className="mt-0.5 text-xs text-diamond-muted">
        {selectable
          ? 'Select products to add with your order (grouped by category).'
          : 'Add any product to your cart (grouped by category).'}
      </p>
      <div className="mt-3 space-y-4">
        {byCategory.map(({ category, items }) => (
          <div key={category.id || 'all'}>
            {byCategory.length > 1 && (
              <p className="text-xs font-medium text-diamond-muted mb-2">{category.name}</p>
            )}
            <ul className="space-y-2">
              {items.map((rec) => {
          const qty = selectedAddons[rec.id] ?? 0
          const fullPrice = rec.price
          const displayPrice = rec.halfTrayAvailable
            ? `${formatPrice(fullPrice / 2)} half / ${formatPrice(fullPrice)} full`
            : formatPrice(fullPrice)
          return (
            <li
              key={rec.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-diamond-border bg-diamond-surface p-2 sm:p-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-diamond text-sm">{rec.name}</p>
                <p className="text-xs text-diamond-muted">{displayPrice}</p>
              </div>
              {selectable ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAddonChange(rec.id, Math.max(0, qty - 1))}
                    className="rounded border border-diamond-border w-8 h-8 flex items-center justify-center text-diamond-muted hover:bg-diamond-border disabled:opacity-50"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm text-diamond">{qty}</span>
                  <button
                    type="button"
                    onClick={() => onAddonChange(rec.id, qty + 1)}
                    className="rounded border border-diamond-border w-8 h-8 flex items-center justify-center text-diamond-muted hover:bg-diamond-border"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              ) : rec.halfTrayAvailable ? (
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onAddAddonToCart?.(rec, 1, 'half')}
                    className="rounded bg-crimson/90 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-crimson shrink-0"
                    title={`Add half tray — ${formatPrice(rec.price / 2)}`}
                  >
                    Half
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddAddonToCart?.(rec, 1, 'full')}
                    className="rounded bg-crimson px-2.5 py-1.5 text-xs font-medium text-white hover:bg-crimson-light shrink-0"
                    title={`Add full tray — ${formatPrice(rec.price)}`}
                  >
                    Full
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onAddAddonToCart?.(rec, 1)}
                  className="rounded bg-crimson px-3 py-1.5 text-xs font-medium text-white hover:bg-crimson-light shrink-0"
                >
                  + Add
                </button>
              )}
            </li>
          )
        })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
