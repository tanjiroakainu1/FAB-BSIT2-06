import { Link } from 'react-router-dom'
import { PageContainer } from '@shared/components'
import { useAppData } from '@shared/context'

export default function AdminDashboard() {
  const { menuItems, orders } = useAppData()
  const today = new Date().toDateString()
  const ordersToday = orders.filter((o) => new Date(o.createdAt).toDateString() === today)
  const pending = orders.filter((o) =>
    ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  )

  const stats = [
    { label: 'Orders today', value: ordersToday.length, href: '/admin/orders', accent: 'from-crimson to-crimson-light' },
    { label: 'Products', value: menuItems.length, href: '/admin/products', accent: 'from-crimson-dark to-crimson' },
    { label: 'Pending orders', value: pending.length, href: '/admin/orders', accent: 'from-crimson to-crimson-light' },
  ]

  const quickLinks = [
    { label: 'Manage categories', href: '/admin/categories' },
    { label: 'Manage products', href: '/admin/products' },
    { label: 'View all orders', href: '/admin/orders' },
    { label: 'User management', href: '/admin/users' },
    { label: 'Chat', href: '/admin/chat' },
    { label: 'System Charts', href: '/admin/system-charts' },
  ]

  return (
    <PageContainer className="pb-12">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-diamond-muted">Overview of your food ordering system.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, href, accent }) => (
          <Link
            key={label}
            to={href}
            className="card-diamond group relative overflow-hidden rounded-xl p-5 sm:p-6 transition-all duration-200 hover:shadow-[0_8px_30px_-8px_rgba(196,30,58,0.25)] min-h-[100px] flex flex-col justify-center touch-manipulation"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`} aria-hidden />
            <h3 className="text-sm font-medium text-diamond-muted">{label}</h3>
            <p className="mt-2 text-3xl font-bold text-crimson">{value}</p>
            <span className="mt-2 inline-block text-sm font-medium text-crimson opacity-0 transition-opacity group-hover:opacity-100">
              View →
            </span>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-diamond">Quick links</h2>
        <p className="mt-1 text-sm text-diamond-muted">Jump to admin sections.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {quickLinks.map(({ label, href }) => (
          <Link
            key={href}
            to={href}
            className="rounded-lg border border-diamond-border bg-diamond-card px-4 py-3 min-h-[44px] sm:py-2.5 sm:min-h-0 inline-flex items-center text-sm font-medium text-diamond transition hover:border-crimson/50 hover:bg-crimson/5 hover:text-crimson touch-manipulation"
          >
            {label}
          </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
