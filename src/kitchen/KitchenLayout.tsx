import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { PageContainer, TeamCreditsFooter } from '@shared/components'
import { useAuth } from '@shared/context'

const navItems = [
  { to: '/kitchen', end: true, label: 'Orders' },
  { to: '/kitchen/history', end: false, label: 'History' },
  { to: '/kitchen/chat', end: false, label: 'Chat' },
]

export default function KitchenLayout() {
  const { user, logout } = useAuth()
  const isKitchen = user?.type === 'kitchen'

  if (!isKitchen) {
    return <Navigate to="/login" replace state={{ from: '/kitchen' }} />
  }

  return (
    <div className="min-h-screen bg-diamond-bg flex flex-col">
      <header className="border-b border-crimson-dark/30 bg-gradient-to-r from-crimson-dark to-crimson shadow-md shrink-0">
        <PageContainer>
          <div className="flex min-h-9 sm:min-h-10 flex-wrap items-center justify-between gap-2 py-1.5 sm:py-1 sm:gap-4">
            <NavLink to="/kitchen" className="text-xs sm:text-base font-semibold text-white sm:text-lg shrink-0 min-w-0 truncate max-w-[140px] sm:max-w-none">
              Food Ordering Hermanas · Kitchen
            </NavLink>
            <nav className="flex flex-wrap items-center gap-1 sm:gap-4 min-h-[36px] lg:hidden">
              {navItems.map(({ to, end, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `text-xs sm:text-sm font-medium py-2 px-1.5 sm:py-0 sm:px-0 min-w-[44px] sm:min-w-0 text-center ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs sm:text-sm font-medium text-white/85 hover:text-white min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 py-2 px-2 -m-2 sm:m-0 lg:hidden"
              >
                Logout
              </button>
            </nav>
            <button
              type="button"
              onClick={() => logout()}
              className="hidden lg:block text-sm font-medium text-white/85 hover:text-white py-2"
            >
              Logout
            </button>
          </div>
        </PageContainer>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className="hidden lg:flex lg:flex-col lg:w-52 xl:w-56 shrink-0 border-r border-diamond-border bg-diamond-card shadow-sm">
          <nav className="p-2 flex flex-col gap-0.5">
            {navItems.map(({ to, end, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `relative flex items-center rounded-lg py-3 pl-4 pr-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-crimson/10 text-crimson'
                      : 'text-diamond-muted hover:bg-diamond-surface hover:text-diamond'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-crimson"
                        aria-hidden
                      />
                    )}
                    <span className={isActive ? 'pl-2' : 'pl-3'}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto p-3 border-t border-diamond-border">
            <button
              type="button"
              onClick={() => logout()}
              className="w-full rounded-lg py-2 text-sm font-medium text-diamond-muted hover:bg-diamond-surface hover:text-diamond"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-0 flex flex-col">
          <div className="scroll-area flex-1 min-h-0">
            <Outlet />
          </div>
          <TeamCreditsFooter />
        </main>
      </div>
    </div>
  )
}
