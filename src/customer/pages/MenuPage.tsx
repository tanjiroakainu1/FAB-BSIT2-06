import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData, useCart } from '@shared/context'

export default function MenuPage() {
  const { categories, menuItems } = useAppData()
  const { addItem } = useCart()
  const availableItems = menuItems.filter((m) => m.available)

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-diamond">Menu</h1>
      <p className="mt-2 text-diamond-muted">Browse and order from our menu.</p>

      {categories.length === 0 && availableItems.length === 0 ? (
        <div className="card-diamond mt-6 rounded-lg p-8 text-center text-diamond-muted">
          No menu items yet. Check back later.
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {categories.map((cat) => {
            const items = availableItems.filter((m) => m.categoryId === cat.id)
            if (items.length === 0) return null
            return (
              <section key={cat.id}>
                <h2 className="text-lg font-semibold text-diamond">{cat.name}</h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="card-diamond rounded-lg overflow-hidden"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-40 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-diamond">{item.name}</h3>
                        {item.description && (
                          <p className="mt-1 text-sm text-diamond-muted">{item.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-crimson">{formatPrice(item.price)}</span>
                        <button
                          type="button"
                          onClick={() => addItem(item.id, item.name, item.price)}
                          className="rounded bg-crimson px-3 py-2.5 min-h-[44px] sm:py-1 sm:min-h-0 text-sm font-medium text-white hover:bg-crimson-light touch-manipulation"
                        >
                          Add to cart
                        </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
          {availableItems.length > 0 &&
            availableItems.every((m) => !categories.some((c) => c.id === m.categoryId)) && (
              <section>
                <h2 className="text-lg font-semibold text-diamond">Other</h2>
                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableItems
                    .filter((m) => !categories.some((c) => c.id === m.categoryId))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="card-diamond rounded-lg overflow-hidden"
                      >
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-40 w-full object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-medium text-diamond">{item.name}</h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-diamond-muted">{item.description}</p>
                          )}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <span className="font-medium text-crimson">{formatPrice(item.price)}</span>
                            <button
                              type="button"
                              onClick={() => addItem(item.id, item.name, item.price)}
                              className="rounded bg-crimson px-3 py-2.5 min-h-[44px] sm:py-1 sm:min-h-0 text-sm font-medium text-white hover:bg-crimson-light touch-manipulation"
                            >
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
        </div>
      )}
    </PageContainer>
  )
}
