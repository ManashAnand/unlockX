'use client'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { PlayerData } from '@/lib/types'

type Props = { playerA: PlayerData; playerB: PlayerData }

function estimateGrowthPoints(followers: number, ageDays: number, label: string) {
  const months = Math.min(ageDays / 30, 18)
  const points = Math.max(Math.floor(months), 6)
  return Array.from({ length: points }, (_, i) => {
    const t = (i + 1) / points
    // S-curve growth: slow start, acceleration in middle, flattening
    const growth = Math.pow(t, 1.6)
    return {
      month: monthLabel(ageDays, i, points),
      [label]: Math.round(followers * growth),
    }
  })
}

function monthLabel(ageDays: number, i: number, total: number): string {
  const now = new Date()
  const startMs = now.getTime() - ageDays * 86400000
  const stepMs = (ageDays * 86400000) / total
  const date = new Date(startMs + stepMs * (i + 1))
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

function mergePoints(
  pointsA: { month: string; A: number }[],
  pointsB: { month: string; B: number }[],
) {
  const longer = pointsA.length >= pointsB.length ? pointsA : pointsB
  const shorter = pointsA.length >= pointsB.length ? pointsB : pointsA
  const keyA = 'A'
  const keyB = 'B'

  return longer.map((pt, i) => {
    const ratio = i / (longer.length - 1)
    const si = Math.round(ratio * (shorter.length - 1))
    return {
      month: pt.month,
      [keyA]: pointsA[Math.round(ratio * (pointsA.length - 1))][keyA],
      [keyB]: pointsB[Math.round(ratio * (pointsB.length - 1))][keyB],
    }
  })
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-md px-3 py-2 text-sm"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--stroke-soft)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <p className="mb-1 font-mono text-[11px] text-tertiary">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="font-sans font-medium" style={{ color: entry.color }}>
          {entry.name} — {fmt(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function GrowthChart({ playerA, playerB }: Props) {
  const rawA = estimateGrowthPoints(
    playerA.profile.followers,
    playerA.profile.account_age_days,
    'A',
  ) as { month: string; A: number }[]

  const rawB = estimateGrowthPoints(
    playerB.profile.followers,
    playerB.profile.account_age_days,
    'B',
  ) as { month: string; B: number }[]

  const data = mergePoints(rawA, rawB)

  return (
    <div>
      <div className="mb-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Estimated Trajectory</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Follower Growth Over Time</h2>
      </div>

      <div
        className="rounded-lg border p-6"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--stroke-soft)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="mb-3 flex items-center gap-4 text-xs text-tertiary font-mono">
          <span
            className="flex items-center gap-1.5"
            style={{ color: 'var(--player-a)' }}
          >
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: 'var(--player-a)' }} />
            {playerA.profile.handle}
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{ color: 'var(--player-b)' }}
          >
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: 'var(--player-b)' }} />
            {playerB.profile.handle}
          </span>
          <span className="ml-auto text-muted italic">Estimated from account age + current followers</span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c7cff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7c7cff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7c4d" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ff7c4d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6a6a78', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#6a6a78', fontSize: 11, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmt}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="A"
              name={playerA.profile.handle}
              stroke="#7c7cff"
              strokeWidth={2}
              fill="url(#gradA)"
              dot={false}
              activeDot={{ r: 4, fill: '#7c7cff', stroke: 'var(--bg-base)', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="B"
              name={playerB.profile.handle}
              stroke="#ff7c4d"
              strokeWidth={2}
              fill="url(#gradB)"
              dot={false}
              activeDot={{ r: 4, fill: '#ff7c4d', stroke: 'var(--bg-base)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
