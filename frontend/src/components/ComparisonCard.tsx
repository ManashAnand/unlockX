'use client'
import { useRouter } from 'next/navigation'

export type ComparisonRow = {
  id: string
  handle_a: string
  handle_b: string
  name_a: string
  name_b: string
  followers_a: number
  followers_b: number
  winner_handle: string
  total_followers: number
  created_at: string
}

type Props = {
  row: ComparisonRow
  rank?: number
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

export default function ComparisonCard({ row, rank }: Props) {
  const router = useRouter()
  const isAWinner = row.winner_handle === row.handle_a

  return (
    <button
      onClick={() => router.push(`/?a=${encodeURIComponent(row.handle_a)}&b=${encodeURIComponent(row.handle_b)}`)}
      className="group relative w-full text-left rounded-xl border border-soft bg-card p-5 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Hover glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,124,255,0.08) 0%, transparent 70%)' }}
      />

      {/* Rank badge */}
      {rank !== undefined && (
        <span
          className="absolute top-3 right-3 font-mono text-[10px] text-tertiary"
          style={{ opacity: 0.5 }}
        >
          #{rank}
        </span>
      )}

      {/* Handles row */}
      <div className="flex items-center gap-3">
        {/* Player A */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {isAWinner && <span className="text-[11px] leading-none">👑</span>}
            <p className="font-mono text-sm font-medium truncate" style={{ color: 'var(--player-a)' }}>
              {row.handle_a}
            </p>
          </div>
          <p className="mt-0.5 font-mono text-[10px] text-tertiary">{fmt(row.followers_a)}</p>
        </div>

        <span className="font-mono text-[10px] uppercase tracking-widest text-muted flex-shrink-0">vs</span>

        {/* Player B */}
        <div className="min-w-0 flex-1 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <p className="font-mono text-sm font-medium truncate" style={{ color: 'var(--player-b)' }}>
              {row.handle_b}
            </p>
            {!isAWinner && <span className="text-[11px] leading-none">👑</span>}
          </div>
          <p className="mt-0.5 font-mono text-[10px] text-tertiary">{fmt(row.followers_b)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-soft pt-3">
        <span className="font-mono text-[10px] text-tertiary">
          {fmt(row.total_followers)} reach
        </span>
        <span className="font-mono text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          Re-run →
        </span>
      </div>
    </button>
  )
}
