import type { Order } from '@shared/types'
import { ColumnChart, LineChart, BarChart, PieChart, ColumnLineChart, type ChartDatum } from './ChartTypes'

function getLast7Days(): string[] {
  const out: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    out.push(d.toDateString())
  }
  return out
}

interface OrdersLast7DaysChartProps {
  orders: Order[]
  title?: string
}

export function OrdersLast7DaysChart({ orders, title = 'Orders last 7 days' }: OrdersLast7DaysChartProps) {
  const last7 = getLast7Days()
  const data: ChartDatum[] = last7.map((day) => ({
    label: new Date(day).toLocaleDateString(undefined, { weekday: 'short' }),
    value: orders.filter((o) => new Date(o.createdAt).toDateString() === day).length,
  }))
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-w-0">
      <ColumnChart data={data} title={title} height={160} />
      <LineChart data={data} title={`${title} (line)`} height={140} color="#c41e3a" />
      <div className="md:col-span-2 xl:col-span-1">
        <ColumnLineChart columnData={data} lineData={data} title={`${title} (column + line)`} height={160} />
      </div>
    </div>
  )
}

type StatusType = 'order' | 'kitchen' | 'delivery'

interface OrdersByStatusChartProps {
  orders: Order[]
  type: StatusType
  title?: string
}

const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] as const
const KITCHEN_STATUSES = ['pending', 'completed'] as const
const DELIVERY_STATUSES = ['pending', 'out_for_delivery', 'delivered', 'picked_up'] as const

function getStatusCounts(orders: Order[], type: StatusType): ChartDatum[] {
  if (type === 'order') {
    return ORDER_STATUSES.map((s) => ({
      label: s,
      value: orders.filter((o) => o.status === s).length,
    }))
  }
  if (type === 'kitchen') {
    return KITCHEN_STATUSES.map((s) => ({
      label: s,
      value: orders.filter((o) => (o.kitchenStatus ?? 'pending') === s).length,
    }))
  }
  return DELIVERY_STATUSES.map((s) => ({
    label: s.replace('_', ' '),
    value: orders.filter((o) => (o.deliveryStatus ?? 'pending') === s).length,
  }))
}

export function OrdersByStatusChart({ orders, type, title }: OrdersByStatusChartProps) {
  const labels: Record<StatusType, string> = {
    order: 'Orders by status',
    kitchen: 'Kitchen status',
    delivery: 'Delivery status',
  }
  const data = getStatusCounts(orders, type)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
      <BarChart data={data} title={title ?? labels[type]} maxBarWidth={240} />
      <PieChart data={data.filter((d) => d.value > 0)} title={`${title ?? labels[type]} (proportion)`} size={160} />
    </div>
  )
}
