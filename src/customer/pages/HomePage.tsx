import { Link } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { formatPrice } from '@shared/utils'
import { useAppData } from '@shared/context'

export default function HomePage() {
  const { categories, menuItems } = useAppData()
  const availableItems = menuItems.filter((m) => m.available)

  return (
    <PageContainer className="pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-crimson-dark/10 via-transparent to-crimson/10 border border-diamond-border px-4 py-8 text-center sm:px-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(196,30,58,0.06)_0%,_transparent_50%)]" aria-hidden />
        <h1 className="relative text-2xl font-bold tracking-tight text-diamond sm:text-4xl">
          Food Ordering Hermanas
        </h1>
        <p className="relative mt-3 max-w-xl mx-auto text-sm text-diamond-muted sm:text-lg">
          Order your favorite dishes. Browse the menu, sign in to add to cart, and we’ll take care of the rest.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/menu"
            className="rounded-lg bg-crimson px-5 py-3 min-h-[48px] inline-flex items-center justify-center font-semibold text-white shadow-md shadow-crimson/20 transition hover:bg-crimson-light hover:shadow-crimson/25 touch-manipulation"
          >
            View menu
          </Link>
          <Link
            to="/login"
            className="rounded-lg border-2 border-crimson/50 bg-transparent px-5 py-3 min-h-[48px] inline-flex items-center justify-center font-semibold text-crimson transition hover:bg-crimson/10 touch-manipulation"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Menu section */}
      <section className="mt-12">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-bold text-diamond sm:text-2xl">Our menu</h2>
          <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
        </div>
        <p className="mt-2 text-diamond-muted">Browse our offerings. Log in or register to place an order.</p>

        {categories.length === 0 && availableItems.length === 0 ? (
          <div className="card-diamond mt-8 rounded-xl p-12 text-center text-diamond-muted">
            <p className="text-sm">No menu items yet. Check back later.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-12">
            {categories.map((cat) => {
              const items = availableItems.filter((m) => m.categoryId === cat.id)
              if (items.length === 0) return null
              return (
                <div key={cat.id}>
                  <h3 className="text-lg font-semibold text-diamond mb-4">{cat.name}</h3>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="card-diamond group rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_-8px_rgba(196,30,58,0.2)]"
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
                          <h4 className="font-semibold text-diamond">{item.name}</h4>
                          {item.description && (
                            <p className="mt-1.5 text-sm text-diamond-muted line-clamp-2">{item.description}</p>
                          )}
                          <p className="mt-3 text-lg font-semibold text-crimson">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            {availableItems.length > 0 &&
              availableItems.every((m) => !categories.some((c) => c.id === m.categoryId)) && (
                <div>
                  <h3 className="text-lg font-semibold text-diamond mb-4">Other</h3>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {availableItems
                      .filter((m) => !categories.some((c) => c.id === m.categoryId))
                      .map((item) => (
                        <div
                          key={item.id}
                          className="card-diamond group rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[0_8px_30px_-8px_rgba(196,30,58,0.2)]"
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
                            <h4 className="font-semibold text-diamond">{item.name}</h4>
                            {item.description && (
                              <p className="mt-1.5 text-sm text-diamond-muted line-clamp-2">{item.description}</p>
                            )}
                            <p className="mt-3 text-lg font-semibold text-crimson">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* CTA */}
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
      </section>
    </PageContainer>
  )
}
