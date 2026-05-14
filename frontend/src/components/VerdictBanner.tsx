import type { CompareResult } from '@/lib/types'

type Props = { result: CompareResult }

function buildTweet(result: CompareResult, winner: typeof result.a, winsCount: number, total: number): string {
  const loser = winner === result.a ? result.b : result.a
  const engRate = winner.analytics.engagement_rate.toFixed(2)
  const tweetCount = winner.analytics.tweet_count

  const text = [
    `Just compared ${winner.profile.handle} vs ${loser.profile.handle} on UnlockX 🔥`,
    ``,
    `${winner.profile.handle} wins ${winsCount}/${total} metrics`,
    `${engRate}% engagement rate across ${tweetCount} posts 📊`,
    ``,
    `Find out who grows faster 👇`,
    `https://unlockx.ai`,
    ``,
    `#TwitterGrowth #CreatorAnalytics`,
  ].join('\n')

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
}

export default function VerdictBanner({ result }: Props) {
  const { a, b } = result

  const metrics: { keyA: keyof typeof a.analytics; keyB: keyof typeof b.analytics; higherWins: boolean; label: string }[] = [
    { keyA: 'engagement_rate', keyB: 'engagement_rate', higherWins: true, label: 'Engagement Rate' },
    { keyA: 'avg_likes', keyB: 'avg_likes', higherWins: true, label: 'Avg Likes' },
    { keyA: 'avg_retweets', keyB: 'avg_retweets', higherWins: true, label: 'Avg Retweets' },
    { keyA: 'avg_replies', keyB: 'avg_replies', higherWins: true, label: 'Avg Replies' },
    { keyA: 'posting_frequency', keyB: 'posting_frequency', higherWins: true, label: 'Posting Freq' },
    { keyA: 'consistency_score', keyB: 'consistency_score', higherWins: true, label: 'Consistency' },
    { keyA: 'thread_ratio', keyB: 'thread_ratio', higherWins: false, label: 'Thread Ratio' },
    { keyA: 'reply_ratio', keyB: 'reply_ratio', higherWins: true, label: 'Reply Ratio' },
  ]

  let winsA = 0
  let winsB = 0
  const outcomes = metrics.map((m) => {
    const va = a.analytics[m.keyA] as number
    const vb = b.analytics[m.keyB] as number
    const aWins = m.higherWins ? va > vb : va < vb
    const bWins = m.higherWins ? vb > va : vb < va
    if (aWins) winsA++
    else if (bWins) winsB++
    return { label: m.label, winner: aWins ? 'a' : bWins ? 'b' : 'tie' }
  })

  const overallWinner = winsA >= winsB ? 'a' : 'b'
  const winner = overallWinner === 'a' ? a : b
  const winsCount = overallWinner === 'a' ? winsA : winsB
  const winnerColor = overallWinner === 'a' ? 'text-player-a' : 'text-player-b'
  const winnerEdge = overallWinner === 'a' ? 'var(--player-a-edge)' : 'var(--player-b-edge)'
  const winnerSoft = overallWinner === 'a' ? 'var(--player-a-soft)' : 'var(--player-b-soft)'
  const winnerGlow = overallWinner === 'a' ? 'var(--glow-a)' : 'var(--glow-b)'
  const gradOrigin = overallWinner === 'a' ? '0% 0%' : '100% 0%'

  const tweetUrl = buildTweet(result, winner, winsCount, metrics.length)

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Summary</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Verdict</h2>
      </div>

      <div
        className="rounded-lg border p-8 text-center"
        style={{
          background: `radial-gradient(120% 80% at ${gradOrigin}, ${winnerSoft}, transparent 60%), var(--bg-card)`,
          borderColor: winnerEdge,
          boxShadow: `var(--shadow-card), ${winnerGlow}`,
        }}
      >
        {/* Trophy */}
        <div className="mb-3 flex justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-warning">
            <path d="M5 3h14v2h2v4a4 4 0 01-4 4H7a4 4 0 01-4-4V5h2V3zm2 2v4a2 2 0 002 2h6a2 2 0 002-2V5H7zm-2 9h10a2 2 0 012 2v1H5v-1a2 2 0 012-2zm-1 5h12v2H6v-2z" />
          </svg>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-widest text-success">Verdict</p>
        <h3 className="mt-2 font-sans text-xl font-semibold text-primary">
          {winner.profile.name} wins
        </h3>
        <p className={`mt-1 font-mono text-sm ${winnerColor}`}>{winner.profile.handle}</p>
        <p className="mt-2 font-mono text-xs text-tertiary">{winsCount} of {metrics.length} metrics</p>

        {/* Win tally pills */}
        <div className="mt-4 flex justify-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-player-a-edge bg-elevated px-4 py-1.5 font-mono text-xs text-player-a">
            {winsA} A wins
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-player-b-edge bg-elevated px-4 py-1.5 font-mono text-xs text-player-b">
            {winsB} B wins
          </span>
        </div>

        {/* Per-metric chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {outcomes.map(({ label, winner: w }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${
                w === 'a'
                  ? 'border-player-a-edge text-player-a'
                  : w === 'b'
                  ? 'border-player-b-edge text-player-b'
                  : 'border-soft text-tertiary'
              }`}
            >
              <span>{w === 'a' ? '▲ A' : w === 'b' ? '▲ B' : '—'}</span>
              <span>{label}</span>
            </span>
          ))}
        </div>

        {/* Share on X */}
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full border px-5 font-sans text-sm font-medium text-primary transition-all hover:-translate-y-px hover:border-default"
          style={{ borderColor: 'var(--stroke-default)', background: 'var(--bg-elevated)' }}
        >
          {/* X logo */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
          </svg>
          Share on X
        </a>
      </div>
    </div>
  )
}
