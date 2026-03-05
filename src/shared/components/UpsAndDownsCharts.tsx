import type { UpsAndDownsEntry } from '@shared/types'
import { PieChart, ColumnChart, AreaChart, type ChartDatum } from './ChartTypes'

function getLast7Days(): string[] {
  const out: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push(d.toDateString())
  }
  return out
}

interface UpsAndDownsChartsProps {
  entries: UpsAndDownsEntry[]
}

export function UpsAndDownsCharts({ entries }: UpsAndDownsChartsProps) {
  const ups = entries.filter((e) => e.type === 'up').length
  const downs = entries.filter((e) => e.type === 'down').length
  const pieData: ChartDatum[] = [
    { label: 'Ups', value: ups },
    { label: 'Downs', value: downs },
  ]

  const last7 = getLast7Days()
  const byDay: ChartDatum[] = last7.map((day) => {
    const total = entries.filter((e) => new Date(e.createdAt).toDateString() === day).length
    return {
      label: new Date(day).toLocaleDateString(undefined, { weekday: 'short' }),
      value: total,
    }
  })

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0 overflow-hidden">
      <div className="w-full max-w-full">
        <PieChart data={pieData} title="Ups vs Downs" size={180} />
      </div>
      <div className="w-full max-w-full min-w-0">
        <ColumnChart data={byDay} title="Last 7 days" height={140} />
      </div>
      <div className="w-full max-w-full min-w-0">
        <AreaChart data={byDay} title="Last 7 days (area)" height={120} color="#86efac" />
      </div>
    </div>
  )
}
