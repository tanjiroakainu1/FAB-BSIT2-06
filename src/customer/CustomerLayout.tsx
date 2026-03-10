import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom'
import { PageContainer, TeamCreditsFooter } from '@shared/components'
import { useAuth, useCart, useAppData } from '@shared/context'

/** Paths that require a logged-in customer; /menu is intentionally left out so guests can browse. */
const PROTECTED_PATHS = ['/cart', '/checkout', '/orders', '/system-charts']

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const { items: cartItems } = useCart()
  const { categories } = useAppData()
  const location = useLocation()
  const isCustomer = user?.type === 'customer'
  const isProtectedPath = PROTECTED_PATHS.includes(location.pathname)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  if (isProtectedPath && !isCustomer) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  const navLinkClass = (isActive: boolean) =>
    `text-xs sm:text-sm font-medium py-1.5 px-2 sm:py-1 sm:px-2 rounded-lg min-w-[44px] sm:min-w-0 text-center transition-colors duration-200 ${
      isActive ? 'text-white bg-white/20' : 'text-white/90 hover:text-white hover:bg-white/10'
    }`

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <header className="relative border-b border-crimson-dark/40 bg-gradient-to-r from-crimson-dark via-crimson to-crimson-dark shadow-lg shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.12)_0%,transparent_50%)]" aria-hidden />
        <PageContainer className="relative">
          <div className="flex min-h-9 sm:min-h-10 flex-wrap items-center justify-between gap-2 py-1.5 sm:py-1 sm:gap-4">
            <NavLink
              to="/home"
              className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-white sm:text-base shrink-0 min-w-0 truncate max-w-[180px] sm:max-w-none hover:text-white/95 transition-opacity"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/20 text-white text-sm" aria-hidden>
                🍽
              </span>
              <span>Food Ordering Hermanas</span>
            </NavLink>
            <nav className="flex flex-wrap items-center gap-0.5 sm:gap-1 min-h-[36px]">
              <NavLink to="/home" end className={({ isActive }) => navLinkClass(isActive)}>
                Home
              </NavLink>
              {isCustomer ? (
                <>
                  <NavLink to="/menu" className={({ isActive }) => navLinkClass(isActive)}>
                    Menu
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) => navLinkClass(isActive) + ' inline-flex items-center justify-center gap-1'}
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="inline-flex items-center justify-center rounded-full bg-white/25 px-1.5 py-0.5 text-xs font-semibold text-white min-w-[1.25rem]">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                  <NavLink to="/orders" className={({ isActive }) => navLinkClass(isActive)}>
                    <span className="hidden sm:inline">Order history</span>
                    <span className="sm:hidden">Orders</span>
                  </NavLink>
                  <NavLink to="/system-charts" className={({ isActive }) => navLinkClass(isActive)}>
                    <span className="hidden md:inline">System Charts</span>
                    <span className="md:hidden">Charts</span>
                  </NavLink>
                  <span className="text-xs sm:text-sm text-white/90 flex items-center flex-wrap gap-1 pl-1">
                    <span className="truncate max-w-[80px] sm:max-w-none font-medium">{user.name}</span>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="rounded-lg px-2 py-1 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <NavLink to="/menu" className={({ isActive }) => navLinkClass(isActive)}>
                    Menu
                  </NavLink>
                  <NavLink to="/forgot-password-monitoring" className={({ isActive }) => navLinkClass(isActive)}>
                    Forgot password
                  </NavLink>
                  <NavLink to="/login" className={({ isActive }) => navLinkClass(isActive)}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className={({ isActive }) => navLinkClass(isActive)}>
                    Register
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 py-1 overflow-x-auto min-h-[32px]">
              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${isActive && !location.search ? 'bg-white/25 text-white' : 'text-white/90 hover:bg-white/15 hover:text-white'}`
                }
              >
                All
              </NavLink>
              {categories.map((cat) => (
                <NavLink
                  key={cat.id}
                  to={`/menu?category=${encodeURIComponent(cat.id)}`}
                  className={({ isActive }) =>
                    `shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition ${isActive ? 'bg-white/25 text-white' : 'text-white/90 hover:bg-white/15 hover:text-white'}`
                  }
                >
                  {cat.name}
                </NavLink>
              ))}
            </div>
          )}
        </PageContainer>
      </header>
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="scroll-area flex-1 min-h-0">
          <Outlet />
        </div>
        <TeamCreditsFooter />
      </main>
    </div>
  )
}
