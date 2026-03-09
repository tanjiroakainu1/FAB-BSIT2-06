import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer, ProductRecommendationsAndAddons } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData, useCart } from '@shared/context'
import type { MenuItem } from '@shared/types'

function ProductModal({
  item,
  recommendations,
  categories,
  allMenuItems,
  onAdd,
  onAddAddons,
  onClose,
}: {
  item: MenuItem
  recommendations: MenuItem[]
  categories: { id: string; name: string }[]
  allMenuItems: MenuItem[]
  onAdd: (price: number, traySize?: 'half' | 'full', notes?: string) => void
  onAddAddons: (addons: { item: MenuItem; quantity: number }[]) => void
  onClose: () => void
}) {
  const includedMealNames =
    item.productType === 'combo' && item.comboItemIds?.length
      ? item.comboItemIds
          .map((id) => allMenuItems.find((m) => m.id === id)?.name)
          .filter(Boolean) as string[]
      : []
  const [traySize, setTraySize] = useState<'half' | 'full'>(item.halfTrayAvailable ? 'full' : 'full')
  const [notes, setNotes] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({})
  const fullPrice = item.price
  const price = item.halfTrayAvailable && traySize === 'half' ? fullPrice / 2 : fullPrice

  const handleAddonChange = (menuItemId: string, quantity: number) => {
    setSelectedAddons((prev) =>
      quantity <= 0 ? (() => { const { [menuItemId]: _, ...rest } = prev; return rest })() : { ...prev, [menuItemId]: quantity }
    )
  }

  const handleAdd = () => {
    onAdd(price, item.halfTrayAvailable ? traySize : undefined, notes.trim() || undefined)
    const addonList = recommendations
      .filter((rec) => (selectedAddons[rec.id] ?? 0) > 0)
      .map((rec) => ({ item: rec, quantity: selectedAddons[rec.id] ?? 1 }))
    if (addonList.length > 0) onAddAddons(addonList)
    onClose()
  }

  const addonsTotal = recommendations.reduce(
    (sum, rec) => sum + rec.price * (selectedAddons[rec.id] ?? 0),
    0
  )
  const totalWithAddons = price + addonsTotal

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="card-diamond w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="product-modal-title" className="text-xl font-bold text-diamond">
                  {item.name}
                </h2>
                {item.productType === 'combo' && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-crimson/15 text-crimson">Combo</span>
                )}
              </div>
              {includedMealNames.length > 0 && (
                <p className="mt-1 text-sm text-diamond-muted">Includes: {includedMealNames.join(', ')}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-diamond-muted hover:text-diamond text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt=""
              className="mt-3 w-full h-48 object-cover rounded-lg"
            />
          )}
          {item.description && (
            <p className="mt-3 text-sm text-diamond-muted">{item.description}</p>
          )}
          <div className="mt-4">
            {item.halfTrayAvailable ? (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tray"
                    checked={traySize === 'half'}
                    onChange={() => setTraySize('half')}
                    className="text-crimson focus:ring-crimson"
                  />
                  <span className="text-diamond">Half tray — {formatPrice(fullPrice / 2)}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tray"
                    checked={traySize === 'full'}
                    onChange={() => setTraySize('full')}
                    className="text-crimson focus:ring-crimson"
                  />
                  <span className="text-diamond">Full tray — {formatPrice(fullPrice)}</span>
                </label>
              </div>
            ) : (
              <p className="font-medium text-crimson">Full tray — {formatPrice(fullPrice)}</p>
            )}
          </div>
          <div className="mt-3">
            <label htmlFor="product-notes" className="block text-sm font-medium text-diamond-muted">
              Notes (optional)
            </label>
            <input
              id="product-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. extra sauce, no onions"
              className="mt-1 w-full rounded border border-diamond-border px-3 py-2 text-diamond text-sm"
            />
          </div>
          <ProductRecommendationsAndAddons
            currentItem={item}
            recommendations={recommendations}
            categories={categories}
            selectedAddons={selectedAddons}
            onAddonChange={handleAddonChange}
            selectable
          />
          <button
            type="button"
            onClick={handleAdd}
            className="mt-6 w-full rounded-lg bg-crimson px-4 py-3 font-medium text-white hover:bg-crimson-light"
          >
            Add to cart — {formatPrice(totalWithAddons)}
            {addonsTotal > 0 && (
              <span className="block text-xs font-normal opacity-90 mt-0.5">
                {formatPrice(price)} + {formatPrice(addonsTotal)} add-ons
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const { categories, menuItems } = useAppData()
  const { addItem } = useCart()
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(categoryParam)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAddonsCardId, setExpandedAddonsCardId] = useState<string | null>(null)
  useEffect(() => {
    setFilterCategoryId(searchParams.get('category'))
  }, [searchParams])

  const availableItems = menuItems.filter((m) => m.available)
  const byCategory =
    filterCategoryId != null && filterCategoryId !== ''
      ? availableItems.filter((m) => m.categoryId === filterCategoryId)
      : availableItems
  const searchLower = searchQuery.trim().toLowerCase()
  const filteredItems = searchLower
    ? byCategory.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          (m.description && m.description.toLowerCase().includes(searchLower))
      )
    : byCategory

  const recommendations = selectedItem
    ? availableItems.filter((m) => m.id !== selectedItem.id)
    : []

  const handleAddFromModal = (price: number, traySize?: 'half' | 'full', notes?: string) => {
    if (!selectedItem) return
    addItem(selectedItem.id, selectedItem.name, price, 1, traySize, notes)
    setSelectedItem(null)
  }

  const handleAddAddonsFromModal = (addons: { item: MenuItem; quantity: number }[]) => {
    addons.forEach(({ item: addonItem, quantity }) => {
      const price = addonItem.halfTrayAvailable ? addonItem.price : addonItem.price
      addItem(addonItem.id, addonItem.name, price, quantity, undefined, 'Add-on')
    })
  }

  const handleAddAddonBelowCard = (item: MenuItem, quantity: number, traySize?: 'half' | 'full') => {
    const price = traySize === 'half' && item.halfTrayAvailable ? item.price / 2 : item.price
    addItem(item.id, item.name, price, quantity, item.halfTrayAvailable ? traySize : undefined, 'Add-on')
  }

  const setCategoryFilter = (id: string | null) => {
    setFilterCategoryId(id)
    if (id) setSearchParams({ category: id })
    else setSearchParams({})
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Menu</h1>
      <p className="mt-2 text-diamond-muted">Browse and order from our menu. Click a product for details and options.</p>

      <div className="mt-4">
        <label htmlFor="menu-search" className="sr-only">Search products</label>
        <input
          id="menu-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name or description..."
          className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
          aria-label="Search products"
        />
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filterCategoryId == null
                ? 'bg-crimson text-white'
                : 'bg-diamond-surface text-diamond-muted hover:bg-diamond-border border border-diamond-border'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filterCategoryId === cat.id
                  ? 'bg-crimson text-white'
                  : 'bg-diamond-surface text-diamond-muted hover:bg-diamond-border border border-diamond-border'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="card-diamond mt-6 rounded-lg p-8 text-center text-diamond-muted">
          {availableItems.length === 0
            ? 'No menu items yet. Check back later.'
            : searchLower
              ? 'No products match your search. Try a different term.'
              : 'No items in this category.'}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const addonsForCard = availableItems.filter((m) => m.id !== item.id)
            const includedNames =
              item.productType === 'combo' && item.comboItemIds?.length
                ? item.comboItemIds
                    .map((id) => menuItems.find((m) => m.id === id)?.name)
                    .filter(Boolean) as string[]
                : []
            return (
              <div key={item.id} className="space-y-3">
                <div className="card-diamond rounded-lg overflow-hidden text-left transition hover:shadow-lg hover:ring-2 hover:ring-crimson/20 relative">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="block w-full text-left"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-diamond">{item.name}</h3>
                        {item.productType === 'combo' && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-crimson/15 text-crimson">Combo</span>
                        )}
                      </div>
                      {includedNames.length > 0 && (
                        <p className="mt-0.5 text-xs text-diamond-muted line-clamp-2">Includes: {includedNames.join(', ')}</p>
                      )}
                      {item.description && (
                        <p className="mt-1 text-sm text-diamond-muted line-clamp-2">{item.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-crimson">
                          {item.halfTrayAvailable
                            ? `${formatPrice(item.price / 2)} half / ${formatPrice(item.price)} full`
                            : formatPrice(item.price)}
                        </span>
                        <span className="text-xs text-diamond-muted">Click for options</span>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                    className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-crimson text-white text-lg font-bold shadow hover:bg-crimson-light"
                    aria-label="Add to cart or view options"
                  >
                    +
                  </button>
                </div>
                {addonsForCard.length > 0 && (
                  <div className="rounded-lg border border-diamond-border bg-diamond-surface overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedAddonsCardId((id) => (id === item.id ? null : item.id))}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium text-diamond hover:bg-diamond-border/50 transition"
                      aria-expanded={expandedAddonsCardId === item.id}
                    >
                      <span className="text-diamond-muted">Add-ons ({addonsForCard.length} products)</span>
                      <span className={`text-diamond-muted transition-transform ${expandedAddonsCardId === item.id ? 'rotate-180' : ''}`} aria-hidden>▼</span>
                    </button>
                    {expandedAddonsCardId === item.id && (
                      <div className="border-t border-diamond-border p-3">
                        <ProductRecommendationsAndAddons
                          currentItem={item}
                          recommendations={addonsForCard}
                          categories={categories}
                          selectedAddons={{}}
                          onAddonChange={() => {}}
                          onAddAddonToCart={handleAddAddonBelowCard}
                          selectable={false}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {selectedItem && (
        <ProductModal
          item={selectedItem}
          recommendations={recommendations}
          categories={categories}
          allMenuItems={menuItems}
          onAdd={handleAddFromModal}
          onAddAddons={handleAddAddonsFromModal}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </PageContainer>
  )
}
