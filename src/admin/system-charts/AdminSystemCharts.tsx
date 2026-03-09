import { PageContainer, UpsAndDownsCharts, OrdersLast7DaysChart, OrdersByStatusChart } from '@shared/components'
import { useAppData } from '@shared/context'

export default function AdminSystemCharts() {
  const { upsAndDowns, orders } = useAppData()

  return (
    <PageContainer className="pb-12">
      <div className="mb-8 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">System Charts</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="text-diamond-muted mb-8">Overview of ups/downs and order metrics.</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-diamond mb-4">Ups &amp; Downs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
          <UpsAndDownsCharts entries={upsAndDowns} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-diamond mb-4">Orders — Last 7 days</h2>
        <OrdersLast7DaysChart orders={orders} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-diamond mb-4">Orders by status</h2>
        <OrdersByStatusChart orders={orders} type="order" />
      </section>
    </PageContainer>
  )
}
