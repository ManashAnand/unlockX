'use client'
import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'

function fmt(value: number, format: string): string {
  switch (format) {
    case 'num':
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
      return value.toLocaleString()
    case 'pct':
      return `${value.toFixed(2)}%`
    case 'freq':
      return `${value.toFixed(1)}/day`
    case 'score':
      return `${value}/100`
    default:
      return String(value)
  }
}

type Props = {
  label: string
  valueA: number
  valueB: number
  format: string
  higherWins: boolean
  index: number
}

export default function CompareRow({ label, valueA, valueB, format, higherWins, index }: Props) {
  const { ref, inView } = useInView()
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setAnimating(true), 60 + index * 80)
      return () => clearTimeout(t)
    }
  }, [inView, index])

  const max = Math.max(valueA, valueB) || 1
  const pctA = (valueA / max) * 100
  const pctB = (valueB / max) * 100
  const winner = higherWins
    ? valueA > valueB ? 'a' : valueB > valueA ? 'b' : 'tie'
    : valueA < valueB ? 'a' : valueB < valueA ? 'b' : 'tie'

  return (
    <div
      ref={ref}
      className="grid grid-cols-[1fr_140px_1fr] items-center gap-4 px-6 py-3 animate-fade-up"
      style={{ animationDelay: `${60 + index * 80}ms` }}
    >
      {/* A side */}
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-mono text-sm tabular-nums font-medium text-player-a">
          {fmt(valueA, format)}
        </span>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <span
            className="bar-fill-a absolute right-0 top-0 h-full rounded-full transition-[width] duration-slower ease-out"
            style={{ width: animating ? `${pctA}%` : '0%' }}
          />
        </div>
      </div>

      {/* Center label */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-center font-mono text-[11px] uppercase leading-tight tracking-widest text-tertiary">
          {label}
        </span>
        {winner === 'a' && <span className="font-mono text-[10px] text-success">▲ A WINS</span>}
        {winner === 'b' && <span className="font-mono text-[10px] text-success">▲ B WINS</span>}
        {winner === 'tie' && <span className="font-mono text-[10px] text-warning">TIE</span>}
      </div>

      {/* B side */}
      <div className="flex flex-col items-start gap-1.5">
        <span className="font-mono text-sm tabular-nums font-medium text-player-b">
          {fmt(valueB, format)}
        </span>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <span
            className="bar-fill-b absolute left-0 top-0 h-full rounded-full transition-[width] duration-slower ease-out"
            style={{ width: animating ? `${pctB}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  )
}
