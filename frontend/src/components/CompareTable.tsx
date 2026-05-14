import Card from './Card'
import CompareRow from './CompareRow'
import type { PlayerData } from '@/lib/types'

const METRICS = [
  { label: 'Engagement Rate', key: 'engagement_rate' as const, format: 'pct', higherWins: true },
  { label: 'Avg Likes',       key: 'avg_likes' as const,       format: 'num', higherWins: true },
  { label: 'Avg Retweets',    key: 'avg_retweets' as const,    format: 'num', higherWins: true },
  { label: 'Avg Replies',     key: 'avg_replies' as const,     format: 'num', higherWins: true },
  { label: 'Posting Freq',    key: 'posting_frequency' as const, format: 'freq', higherWins: true },
  { label: 'Consistency',     key: 'consistency_score' as const, format: 'score', higherWins: true },
  { label: 'Thread Ratio',    key: 'thread_ratio' as const,    format: 'pct', higherWins: false },
  { label: 'Reply Ratio',     key: 'reply_ratio' as const,     format: 'pct', higherWins: true },
]

type Props = { playerA: PlayerData; playerB: PlayerData }

export default function CompareTable({ playerA, playerB }: Props) {
  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Breakdown</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Head-to-Head</h2>
      </div>
      <div className="overflow-hidden rounded-lg border border-soft bg-card shadow-card divide-y divide-faint">
        {METRICS.map((m, i) => (
          <CompareRow
            key={m.key}
            label={m.label}
            valueA={playerA.analytics[m.key] as number}
            valueB={playerB.analytics[m.key] as number}
            format={m.format}
            higherWins={m.higherWins}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
