import type { AIInsights as AIInsightsType, PlayerData } from '@/lib/types'

type Props = { insights: AIInsightsType; playerA: PlayerData; playerB: PlayerData }

export default function AIInsights({ insights, playerA, playerB }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">AI Analysis</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Growth Intelligence</h2>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-soft bg-card p-6 shadow-card">
        <p className="text-base text-secondary leading-relaxed">{insights.summary}</p>
      </div>

      {/* Two-column: Why A grows faster + Recommendations for B */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Why A */}
        <div
          className="rounded-lg border p-6"
          style={{
            background: 'radial-gradient(120% 80% at 0% 0%, var(--player-a-soft), transparent 60%), var(--bg-card)',
            borderColor: 'var(--player-a-edge)',
            boxShadow: 'var(--shadow-card), var(--glow-a)',
          }}
        >
          <div className="mb-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">
              Why {playerA.profile.handle} grows faster
            </span>
          </div>
          <ol className="space-y-3">
            {insights.why_a_grows_faster.map((reason, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs tabular-nums text-player-a mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-secondary leading-relaxed">{reason}</span>
              </li>
            ))}
          </ol>
          {/* Creator DNA */}
          <div className="mt-5 border-t border-faint pt-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Creator DNA</span>
            <p className="mt-1 font-sans text-base font-medium text-player-a">{insights.creator_dna_a}</p>
          </div>
        </div>

        {/* Recommendations for B */}
        <div
          className="rounded-lg border p-6"
          style={{
            background: 'radial-gradient(120% 80% at 100% 0%, var(--player-b-soft), transparent 60%), var(--bg-card)',
            borderColor: 'var(--player-b-edge)',
            boxShadow: 'var(--shadow-card), var(--glow-b)',
          }}
        >
          <div className="mb-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">
              What {playerB.profile.handle} should do
            </span>
          </div>
          <ol className="space-y-3">
            {insights.recommendations_for_b.map((rec, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs tabular-nums text-player-b mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-secondary leading-relaxed">{rec}</span>
              </li>
            ))}
          </ol>
          {/* Creator DNA */}
          <div className="mt-5 border-t border-faint pt-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Creator DNA</span>
            <p className="mt-1 font-sans text-base font-medium text-player-b">{insights.creator_dna_b}</p>
          </div>
        </div>
      </div>

      {/* Underdog Growth Blueprint — full width */}
      {insights.underdog_tips && insights.underdog_tips.length > 0 && (
        <div
          className="rounded-lg border p-6"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(250,204,21,0.06), transparent 70%), var(--bg-card)',
            borderColor: 'rgba(250,204,21,0.25)',
            boxShadow: 'var(--shadow-card), 0 0 60px -20px rgba(250,204,21,0.15)',
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
              style={{ background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.3)' }}
            >
              ⚡
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Growth Blueprint</span>
              <p className="font-sans text-base font-semibold text-primary">
                What {insights.underdog_handle} should steal from the leader
              </p>
            </div>
          </div>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {insights.underdog_tips.map((tip, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-md p-3"
                style={{ background: 'rgba(250,204,21,0.04)', border: '1px solid rgba(250,204,21,0.10)' }}
              >
                <span
                  className="font-mono text-xs tabular-nums mt-0.5 flex-shrink-0 font-semibold"
                  style={{ color: 'rgba(250,204,21,0.8)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-secondary leading-relaxed">{tip}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
