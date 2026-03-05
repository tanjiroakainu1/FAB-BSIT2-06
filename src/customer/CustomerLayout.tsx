import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom'
import { PageContainer, TeamCreditsFooter } from '@shared/components'
import { useAuth, useCart } from '@shared/context'

const PROTECTED_PATHS = ['/menu', '/cart', '/checkout', '/orders', '/system-charts']

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const { items: cartItems } = useCart()
  const location = useLocation()
  const isCustomer = user?.type === 'customer'
  const isProtectedPath = PROTECTED_PATHS.includes(location.pathname)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  if (isProtectedPath && !isCustomer) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <header className="border-b border-crimson-dark/30 bg-gradient-to-r from-crimson-dark to-crimson shadow-md shrink-0">
        <PageContainer>
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 py-3 sm:py-0 sm:gap-6">
            <NavLink to="/home" className="text-sm font-semibold text-white sm:text-lg shrink-0 min-w-0 truncate max-w-[160px] sm:max-w-none">
              Food Ordering Hermanas
            </NavLink>
            <nav className="flex flex-wrap items-center gap-2 sm:gap-6 min-h-[44px]">
              <NavLink
                to="/home"
                end
                className={({ isActive }) =>
                  `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                }
              >
                Home
              </NavLink>
              {isCustomer ? (
                <>
                  <NavLink
                    to="/menu"
                    className={({ isActive }) =>
                      `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                    }
                  >
                    Menu
                  </NavLink>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center inline-flex items-center justify-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                    }
                  >
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-white/25 px-1.5 py-0.5 text-xs font-medium text-white min-w-[1.25rem]">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                    }
                  >
                    <span className="hidden sm:inline">Order history</span>
                    <span className="sm:hidden">Orders</span>
                  </NavLink>
                  <NavLink
                    to="/system-charts"
                    className={({ isActive }) =>
                      `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                    }
                  >
                    <span className="hidden md:inline">System Charts</span>
                    <span className="md:hidden">Charts</span>
                  </NavLink>
                  <span className="text-xs sm:text-sm text-white/85 flex items-center flex-wrap gap-1">
                    <span className="truncate max-w-[80px] sm:max-w-none">{user.name}</span>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="min-h-[44px] min-w-[44px] sm:min-w-0 sm:min-h-0 py-2 px-2 font-medium text-white hover:text-white/90 -m-2 sm:m-0 sm:ml-2"
                    >
                      Logout
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `text-xs sm:text-sm font-medium py-2 px-1 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </PageContainer>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <TeamCreditsFooter />
    </div>
  )
}
