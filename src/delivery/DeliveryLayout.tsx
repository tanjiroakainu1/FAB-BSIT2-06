import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { PageContainer, TeamCreditsFooter } from '@shared/components'
import { useAuth } from '@shared/context'

const navItems = [
  { to: '/delivery', end: true, label: 'Deliveries' },
  { to: '/delivery/chat', end: false, label: 'Chat' },
  { to: '/delivery/system-charts', end: false, label: 'System Charts' },
]

export default function DeliveryLayout() {
  const { user, logout } = useAuth()
  const isDeliveryGuy = user?.type === 'deliveryguy'

  if (!isDeliveryGuy) {
    return <Navigate to="/login" replace state={{ from: '/delivery' }} />
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <header className="border-b border-crimson-dark/30 bg-gradient-to-r from-crimson-dark to-crimson shadow-md shrink-0">
        <PageContainer>
          <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 py-3 sm:py-0 sm:gap-6">
            <NavLink to="/delivery" className="text-xs sm:text-base font-semibold text-white sm:text-lg shrink-0 min-w-0 truncate max-w-[140px] sm:max-w-none">
              Food Ordering Hermanas · Delivery
            </NavLink>
            <nav className="flex flex-wrap items-center gap-1 sm:gap-6 min-h-[44px]">
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
                className="text-xs sm:text-sm font-medium text-white/85 hover:text-white min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 py-2 px-2 -m-2 sm:m-0"
              >
                Logout
              </button>
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
