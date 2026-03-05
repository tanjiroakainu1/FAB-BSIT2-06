import { PageContainer, UpsAndDownsCharts, OrdersLast7DaysChart, OrdersByStatusChart } from '@shared/components'
import { useAppData } from '@shared/context'

export default function DeliverySystemCharts() {
  const { upsAndDowns, orders } = useAppData()
  const deliveryEntries = upsAndDowns.filter((e) => e.role === 'delivery')

  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">System Charts</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0">
          <UpsAndDownsCharts entries={deliveryEntries} />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <OrdersLast7DaysChart orders={orders} />
        </div>
        <div className="min-w-0 lg:col-span-2 xl:col-span-3">
          <OrdersByStatusChart orders={orders} type="delivery" />
        </div>
      </div>
    </PageContainer>
  )
}
