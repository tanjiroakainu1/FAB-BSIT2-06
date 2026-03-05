import { useMemo } from 'react'

const FLOATING_COUNT = 56
const RAINDROP_COUNT = 24

function seed(s: number) {
  const x = Math.sin(s) * 10000
  return x - Math.floor(x)
}

export function ParticlesBackground() {
  const floating = useMemo(() => {
    return Array.from({ length: FLOATING_COUNT }, (_, i) => {
      const s = (i + 1) * 1.618
      return {
        left: seed(s) * 100,
        top: seed(s + 7) * 100,
        delay: seed(s + 13) * -20,
        variant: i % 3 as 0 | 1 | 2,
      }
    })
  }, [])

  const raindrops = useMemo(() => {
    return Array.from({ length: RAINDROP_COUNT }, (_, i) => {
      const s = (i + 1) * 2.917
      return {
        left: seed(s) * 100,
        delay: seed(s + 11) * -12,
      }
    })
  }, [])

  return (
    <div className="particles-layer" aria-hidden>
      {floating.map((p, i) => (
        <div
          key={`f-${i}`}
          className={`particle ${
            p.variant === 1 ? 'particle--alt' : p.variant === 2 ? 'particle--diamond' : ''
          }`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {raindrops.map((r, i) => (
        <div
          key={`r-${i}`}
          className="particle--raindrop"
          style={{
            left: `${r.left}%`,
            top: '-5%',
            animationDelay: `${r.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
