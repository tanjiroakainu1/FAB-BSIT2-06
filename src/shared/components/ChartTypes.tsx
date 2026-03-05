import { useState } from 'react'

/** Chart colors aligned with reference: light blue, green, orange, pink, etc. */
export const CHART_COLORS = [
  '#7dd3fc', /* light blue */
  '#86efac', /* light green */
  '#fdba74', /* orange */
  '#f9a8d4', /* light pink */
  '#c4b5fd', /* light purple */
  '#fde047', /* yellow */
] as const

export interface ChartDatum {
  label: string
  value: number
}

/** Pie chart – circular slices with legend (grey leader lines to labels). */
export function PieChart({
  data,
  title,
  size = 180,
}: {
  data: ChartDatum[]
  title?: string
  size?: number
}) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) {
    return (
      <div className="card-diamond rounded-xl p-4 sm:p-5 min-w-0 max-w-full overflow-hidden">
        {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
        <div className="flex items-center justify-center rounded-full bg-diamond-surface" style={{ width: size, height: size }}>
          <span className="text-sm text-diamond-muted">No data</span>
        </div>
      </div>
    )
  }
  const conicGradient = `conic-gradient(from 0deg, ${data.map((d, i) => {
    const pct = (d.value / total) * 100
    const start = data.slice(0, i).reduce((s, x) => s + (x.value / total) * 100, 0)
    return `${CHART_COLORS[i % CHART_COLORS.length]} ${start}% ${start + pct}%`
  }).join(', ')})`
  return (
    <div className="card-diamond rounded-xl p-4 sm:p-5 min-w-0 max-w-full overflow-hidden">
      {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div
          className="rounded-full border-2 border-white shadow-md flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 max-w-full"
          style={{
            width: size,
            height: size,
            background: conicGradient,
          }}
          title={data.map((d) => `${d.label}: ${d.value} (${total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%)`).join(' · ')}
        />
        <div className="flex flex-col gap-2">
          {data.map((d, i) => {
            const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : 0
            return (
              <div
                key={d.label}
                className="flex items-center gap-2 text-sm cursor-default rounded px-2 py-0.5 transition-colors hover:bg-diamond-surface"
                title={`${d.label}: ${d.value} (${pct}%)`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-diamond-muted capitalize">{d.label}</span>
                <span className="text-diamond font-medium">{pct}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** Column chart – vertical bars, one color per bar. Interactive hover + tooltip. */
export function ColumnChart({
  data,
  title,
  height = 160,
  barColors,
}: {
  data: ChartDatum[]
  title?: string
  height?: number
  barColors?: readonly string[]
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const colors = barColors ?? CHART_COLORS
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="card-diamond rounded-xl p-4 sm:p-5 relative min-w-0 max-w-full overflow-hidden">
      {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
      <div className="flex items-end justify-between gap-1 sm:gap-2" style={{ minHeight: height }}>
        {data.map((d, i) => (
          <div
            key={d.label}
            className="relative flex-1 flex flex-col items-center gap-1 min-w-0 cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === i && (
              <div className="absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 -translate-y-1 rounded-lg border border-diamond-border bg-diamond-card px-2.5 py-1.5 text-xs font-medium text-diamond shadow-lg whitespace-nowrap">
                {d.label}: <span className="text-crimson">{d.value}</span>
              </div>
            )}
            <span className="text-xs font-medium text-diamond">{d.value}</span>
            <div
              className="w-full max-w-[48px] rounded-t transition-all duration-300 flex flex-col justify-end"
              style={{ height }}
            >
              <div
                className={`w-full rounded-t min-h-0 transition-all duration-300 ${hovered === i ? 'opacity-90 ring-2 ring-crimson/50 ring-offset-2 ring-offset-diamond-card' : ''}`}
                style={{
                  height: `${(d.value / max) * 100}%`,
                  minHeight: d.value > 0 ? 4 : 0,
                  backgroundColor: colors[i % colors.length],
                }}
              />
            </div>
            <span className="text-xs text-diamond-muted truncate max-w-full text-center capitalize" title={d.label}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Line chart – points connected by line over categories. Interactive hover + tooltip. */
export function LineChart({
  data,
  title,
  height = 140,
  color = '#c41e3a',
}: {
  data: ChartDatum[]
  title?: string
  height?: number
  color?: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value), 1)
  const w = 280
  const padding = { top: 8, right: 8, bottom: 24, left: 28 }
  const innerW = w - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const points = data.map((d, i) => {
    const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2)
    const y = padding.top + innerH - (d.value / max) * innerH
    return `${x},${y}`
  }).join(' ')
  return (
    <div className="card-diamond rounded-xl p-4 sm:p-5 min-w-0 max-w-full overflow-hidden">
      {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full max-w-full cursor-crosshair" preserveAspectRatio="xMidYMid meet">
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} stroke="#e8e4e6" strokeWidth="1" />
        <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW} y2={padding.top + innerH} stroke="#e8e4e6" strokeWidth="1" />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.map((d, i) => {
          const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2)
          const y = padding.top + innerH - (d.value / max) * innerH
          return (
            <g key={d.label}>
              <title>{`${d.label}: ${d.value}`}</title>
              <circle
                cx={x}
                cy={y}
                r={hovered === i ? 8 : 4}
                fill={color}
                className="cursor-pointer transition-all duration-200"
                style={{ opacity: hovered === i ? 1 : 0.9 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          )
        })}
        {data.map((d, i) => {
          const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2)
          return (
            <text key={d.label} x={x} y={height - 4} textAnchor="middle" className="text-[10px] fill-diamond-muted pointer-events-none" style={{ fill: '#6b6368' }}>{d.label}</text>
          )
        })}
      </svg>
    </div>
  )
}

/** Bar chart – horizontal bars. Interactive hover + tooltip. */
export function BarChart({
  data,
  title,
  maxBarWidth = 200,
  barColors,
}: {
  data: ChartDatum[]
  title?: string
  maxBarWidth?: number
  barColors?: readonly string[]
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const colors = barColors ?? CHART_COLORS
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="card-diamond rounded-xl p-4 sm:p-5 min-w-0 max-w-full overflow-hidden">
      {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
      <div className="flex flex-col gap-3">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            title={`${d.label}: ${d.value}`}
          >
            <span className="text-xs text-diamond-muted capitalize w-24 truncate">{d.label}</span>
            <div className="flex-1 h-6 rounded bg-diamond-surface overflow-hidden flex relative">
              <div
                className={`h-full rounded transition-all duration-300 min-w-0 ${hovered === i ? 'ring-2 ring-crimson/50 ring-offset-1 ring-offset-diamond-surface' : ''}`}
                style={{
                  width: `${(d.value / max) * 100}%`,
                  maxWidth: maxBarWidth,
                  minWidth: d.value > 0 ? 8 : 0,
                  backgroundColor: colors[i % colors.length],
                }}
              />
              {hovered === i && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded border border-diamond-border bg-diamond-card px-2 py-0.5 text-xs font-medium text-diamond shadow whitespace-nowrap">
                  {d.label}: <span className="text-crimson">{d.value}</span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-diamond w-6 text-right">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Area chart – filled region under the line. Interactive hover on points. */
export function AreaChart({
  data,
  title,
  height = 140,
  color = '#86efac',
}: {
  data: ChartDatum[]
  title?: string
  height?: number
  color?: string
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value), 1)
  const w = 280
  const padding = { top: 8, right: 8, bottom: 24, left: 28 }
  const innerW = w - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const baseY = padding.top + innerH
  const points = data.map((d, i) => {
    const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2)
    const y = padding.top + innerH - (d.value / max) * innerH
    return { x, y, ...d }
  })
  const areaPath = points.length
    ? `M ${padding.left},${baseY} L ${points.map((p) => `${p.x},${p.y}`).join(' L ')} L ${padding.left + innerW},${baseY} Z`
    : ''
  return (
    <div className="card-diamond rounded-xl p-4 sm:p-5 min-w-0 max-w-full overflow-hidden">
      {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full max-w-full cursor-crosshair" preserveAspectRatio="xMidYMid meet">
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={baseY} stroke="#e8e4e6" strokeWidth="1" />
        <line x1={padding.left} y1={baseY} x2={padding.left + innerW} y2={baseY} stroke="#e8e4e6" strokeWidth="1" />
        <path d={areaPath} fill={color} fillOpacity="0.7" className="transition-opacity hover:opacity-80" />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        />
        {points.map((d, i) => (
          <g key={d.label}>
            <title>{`${d.label}: ${d.value}`}</title>
            <circle
              cx={d.x}
              cy={d.y}
              r={hovered === i ? 8 : 4}
              fill={color}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        ))}
        {data.map((d, i) => {
          const x = padding.left + (data.length > 1 ? (i / (data.length - 1)) * innerW : innerW / 2)
          return (
            <text key={d.label} x={x} y={height - 4} textAnchor="middle" className="pointer-events-none" style={{ fill: '#6b6368', fontSize: 10 }}>{d.label}</text>
          )
        })}
      </svg>
    </div>
  )
}

/** Column-Line chart – columns with a dotted trend line. Interactive hover on columns. */
export function ColumnLineChart({
  columnData,
  lineData,
  title,
  height = 160,
}: {
  columnData: ChartDatum[]
  lineData: ChartDatum[]
  title?: string
  height?: number
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const max = Math.max(
    ...columnData.map((d) => d.value),
    ...(lineData.length ? lineData.map((d) => d.value) : [1]),
    1
  )
  const w = 280
  const pad = { left: 24, bottom: 20 }
  const innerW = w - pad.left - 16
  const innerH = height - 36
  const linePoints = lineData.length > 0
    ? lineData.map((d, i) => {
        const x = pad.left + (lineData.length > 1 ? (i / (lineData.length - 1)) * innerW : innerW / 2)
        const y = 8 + innerH - (d.value / max) * innerH
        return `${x},${y}`
      }).join(' ')
    : ''
  return (
    <div className="card-diamond rounded-xl p-4 sm:p-5 relative min-w-0 max-w-full overflow-hidden">
      {title && <h3 className="text-sm font-medium text-diamond-muted mb-4">{title}</h3>}
      <div className="relative">
        <div className="flex items-end justify-between gap-1" style={{ minHeight: height }}>
          {columnData.map((d, i) => (
            <div
              key={d.label}
              className="relative flex-1 flex flex-col items-center gap-1 min-w-0 cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === i && (
                <div className="absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 -translate-y-1 rounded-lg border border-diamond-border bg-diamond-card px-2.5 py-1.5 text-xs font-medium text-diamond shadow-lg whitespace-nowrap">
                  {d.label}: <span className="text-crimson">{d.value}</span>
                </div>
              )}
              <span className="text-xs font-medium text-diamond">{d.value}</span>
              <div className="w-full max-w-[40px] rounded-t flex flex-col justify-end" style={{ height: innerH }}>
                <div
                  className={`w-full rounded-t transition-all duration-300 ${hovered === i ? 'opacity-90 ring-2 ring-crimson/50 ring-offset-2 ring-offset-diamond-card' : ''}`}
                  style={{
                    height: `${(d.value / max) * 100}%`,
                    minHeight: d.value > 0 ? 4 : 0,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
              </div>
              <span className="text-xs text-diamond-muted truncate max-w-full text-center capitalize" title={d.label}>{d.label}</span>
            </div>
          ))}
        </div>
        {linePoints && (
          <svg viewBox={`0 0 ${w} ${height}`} className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid meet">
            <polyline fill="none" stroke="#fdba74" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round" points={linePoints} />
          </svg>
        )}
      </div>
    </div>
  )
}
