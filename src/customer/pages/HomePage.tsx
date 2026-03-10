import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData, useAuth } from '@shared/context'

export default function HomePage() {
  const { user } = useAuth()
  const { categories, menuItems } = useAppData()
  const isSignedIn = !!user
  const [searchQuery, setSearchQuery] = useState('')
  const availableItems = menuItems.filter((m) => m.available)
  const searchLower = searchQuery.trim().toLowerCase()
  const searchFilter = (m: (typeof availableItems)[0]) =>
    !searchLower ||
    m.name.toLowerCase().includes(searchLower) ||
    (m.description && m.description.toLowerCase().includes(searchLower))
  const itemsToShow = searchLower ? availableItems.filter(searchFilter) : availableItems

  return (
    <PageContainer className="pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-crimson-dark/10 via-transparent to-crimson/10 border border-diamond-border px-4 py-8 text-center sm:px-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(196,30,58,0.06)_0%,_transparent_50%)]" aria-hidden />
        <h1 className="relative text-2xl font-bold tracking-tight text-diamond sm:text-4xl">
          Food Ordering Hermanas
        </h1>
        <p className="relative mt-3 max-w-xl mx-auto text-sm text-diamond-muted sm:text-lg">
          {isSignedIn
            ? "Order your favorite dishes. Browse the menu, add to cart, and we'll take care of the rest."
            : "Order your favorite dishes. Browse the menu, sign in to add to cart, and we'll take care of the rest."}
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/menu"
            className="rounded-lg bg-crimson px-5 py-3 min-h-[48px] inline-flex items-center justify-center font-semibold text-white shadow-md shadow-crimson/20 transition hover:bg-crimson-light hover:shadow-crimson/25 touch-manipulation"
          >
            View menu
          </Link>
          {!isSignedIn && (
            <Link
              to="/login"
              className="rounded-lg border-2 border-crimson/50 bg-transparent px-5 py-3 min-h-[48px] inline-flex items-center justify-center font-semibold text-crimson transition hover:bg-crimson/10 touch-manipulation"
            >
              Sign in
            </Link>
          )}
        </div>
      </section>

      {/* How the system works */}
      <section className="mt-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-diamond sm:text-2xl">How the system works</h2>
          <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
        </div>
        <p className="mt-2 text-diamond-muted">Our ordering and fulfillment flow from browse to delivery.</p>
        <div className="card-diamond mt-6 rounded-xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-diamond mb-4">Customer flow</h3>
          <ol className="space-y-3 text-sm text-diamond-muted">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson/15 text-crimson text-xs font-bold">1</span>
              <span><strong className="text-diamond">Browse the menu</strong> — You can view and search the menu here or on the Menu page without logging in. Filter by category to find dishes, combos, and add-ons.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson/15 text-crimson text-xs font-bold">2</span>
              <span>
                {isSignedIn ? (
                  <><strong className="text-diamond">You&apos;re signed in</strong> — You can add items to the cart and place an order from the Menu or Cart.</>
                ) : (
                  <><strong className="text-diamond">Sign in or register</strong> — To add items to the cart and place an order, log in or create an account.</>
                )}
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson/15 text-crimson text-xs font-bold">3</span>
              <span><strong className="text-diamond">Add to cart</strong> — Open a product to choose half/full tray, notes, and add-ons. Your cart keeps main items and add-ons separate with images.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson/15 text-crimson text-xs font-bold">4</span>
              <span><strong className="text-diamond">Checkout</strong> — Enter when you need the order (date & time), payment method (Cash or GCash), contact and delivery details, then place the order.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson/15 text-crimson text-xs font-bold">5</span>
              <span><strong className="text-diamond">Order history</strong> — View your orders and status anytime. Use “View details” to see full order info and items.</span>
            </li>
          </ol>
          <h3 className="text-base font-semibold text-diamond mt-6 mb-3">Behind the scenes</h3>
          <ul className="space-y-2 text-sm text-diamond-muted">
            <li>• <strong className="text-diamond">Admin</strong> manages the menu (categories, products, combos), orders, and forgot-password requests, and chats with staff.</li>
            <li>• <strong className="text-diamond">Kitchen</strong> sees pending orders and marks them ready when prepared.</li>
            <li>• <strong className="text-diamond">Delivery</strong> sees active deliveries, marks them done when delivered or picked up, and can view delivery history.</li>
          </ul>
        </div>
      </section>

      {/* Menu section */}
      <section className="mt-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-diamond sm:text-2xl">Our menu</h2>
          <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
        </div>
        <p className="mt-2 text-diamond-muted">
          {isSignedIn ? 'Browse our offerings. Add items to your cart to place an order.' : 'Browse our offerings. Log in or register to place an order.'}
        </p>

        {availableItems.length > 0 && (
          <div className="mt-4">
            <label htmlFor="home-menu-search" className="sr-only">Search products</label>
            <input
              id="home-menu-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or description..."
              className="w-full max-w-md rounded-lg border border-diamond-border bg-diamond-surface px-4 py-2.5 text-diamond placeholder-diamond-muted focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
              aria-label="Search products"
            />
          </div>
        )}

        {categories.length === 0 && availableItems.length === 0 ? (
          <div className="card-diamond mt-8 rounded-xl p-12 text-center text-diamond-muted">
            <p className="text-sm">No menu items yet. Check back later.</p>
          </div>
        ) : searchLower && itemsToShow.length === 0 ? (
          <div className="card-diamond mt-8 rounded-xl p-8 text-center text-diamond-muted">
            <p className="text-sm">No products match your search. Try a different term or <Link to="/menu" className="text-crimson hover:underline">browse the full menu</Link>.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {categories.map((cat) => {
              const items = itemsToShow.filter((m) => m.categoryId === cat.id)
              if (items.length === 0) return null
              return (
                <div key={cat.id}>
                  <h3 className="text-lg font-semibold text-diamond mb-4">{cat.name}</h3>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const includedNames =
                        item.productType === 'combo' && item.comboItemIds?.length
                          ? item.comboItemIds
                              .map((id) => menuItems.find((m) => m.id === id)?.name)
                              .filter(Boolean) as string[]
                          : []
                      return (
                        <div
                          key={item.id}
                          className="card-diamond group rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_-8px_rgba(211,47,47,0.2)]"
                        >
                          {item.imageUrl && (
                            <div className="relative h-44 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                            </div>
                          )}
                          <div className="p-4 sm:p-5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-diamond">{item.name}</h4>
                              {item.productType === 'combo' && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-crimson/15 text-crimson">Combo</span>
                              )}
                            </div>
                            {includedNames.length > 0 && (
                              <p className="mt-0.5 text-xs text-diamond-muted line-clamp-2">Includes: {includedNames.join(', ')}</p>
                            )}
                            {item.description && (
                              <p className="mt-1.5 text-sm text-diamond-muted line-clamp-2">{item.description}</p>
                            )}
                            <p className="mt-3 text-lg font-semibold text-crimson">
                              {item.halfTrayAvailable
                                ? `${formatPrice(item.price / 2)} half / ${formatPrice(item.price)} full`
                                : formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {itemsToShow.length > 0 &&
              itemsToShow.every((m) => !categories.some((c) => c.id === m.categoryId)) && (
                <div>
                  <h3 className="text-lg font-semibold text-diamond mb-4">Other</h3>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {itemsToShow
                      .filter((m) => !categories.some((c) => c.id === m.categoryId))
                      .map((item) => {
                        const includedNames =
                          item.productType === 'combo' && item.comboItemIds?.length
                            ? item.comboItemIds
                                .map((id) => menuItems.find((m) => m.id === id)?.name)
                                .filter(Boolean) as string[]
                            : []
                        return (
                          <div
                            key={item.id}
                            className="card-diamond group rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_-8px_rgba(211,47,47,0.2)]"
                          >
                            {item.imageUrl && (
                              <div className="relative h-44 overflow-hidden">
                                <img
                                  src={item.imageUrl}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="p-4 sm:p-5">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-diamond">{item.name}</h4>
                                {item.productType === 'combo' && (
                                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-crimson/15 text-crimson">Combo</span>
                                )}
                              </div>
                              {includedNames.length > 0 && (
                                <p className="mt-0.5 text-xs text-diamond-muted line-clamp-2">Includes: {includedNames.join(', ')}</p>
                              )}
                              {item.description && (
                                <p className="mt-1.5 text-sm text-diamond-muted line-clamp-2">{item.description}</p>
                              )}
                              <p className="mt-3 text-lg font-semibold text-crimson">
                                {item.halfTrayAvailable
                                  ? `${formatPrice(item.price / 2)} half / ${formatPrice(item.price)} full`
                                  : formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* CTA — only show sign-in prompt for non–signed-in users */}
        {!isSignedIn && (
          <div className="card-diamond mt-14 rounded-xl p-8 text-center sm:p-10">
            <p className="text-lg font-semibold text-diamond">Ready to order?</p>
            <p className="mt-2 text-sm text-diamond-muted">Log in or create an account to add items to your cart.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="rounded-lg bg-crimson px-6 py-3 font-semibold text-white shadow-md shadow-crimson/20 transition hover:bg-crimson-light w-full sm:w-auto text-center"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-lg border-2 border-diamond-border px-6 py-3 font-semibold text-diamond-muted transition hover:bg-diamond-surface hover:border-crimson/30 hover:text-crimson w-full sm:w-auto text-center"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </section>
    </PageContainer>
  )
}
