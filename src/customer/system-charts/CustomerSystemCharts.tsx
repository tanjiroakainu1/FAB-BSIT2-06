import { PageContainer } from '@shared/components'

export default function CustomerSystemCharts() {
  return (
    <PageContainer className="pb-12">
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-diamond sm:text-3xl">System Charts</h1>
        <span className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-crimson/60 to-transparent" aria-hidden />
      </div>
      <p className="mt-2 text-diamond-muted">View system charts as a customer.</p>
      <div className="card-diamond mt-8 rounded-xl p-8 text-center">
        <p className="text-diamond-muted">System Charts — customer.</p>
      </div>
    </PageContainer>
  )
}
