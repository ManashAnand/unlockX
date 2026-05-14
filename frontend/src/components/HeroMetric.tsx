'use client'
import VsPill from './VsPill'
import { useInView } from '@/hooks/useInView'
import { useCounter } from '@/hooks/useCounter'
import type { PlayerData } from '@/lib/types'

type Props = { playerA: PlayerData; playerB: PlayerData }

export default function HeroMetric({ playerA, playerB }: Props) {
  const { ref, inView } = useInView()
  const countA = useCounter(playerA.analytics.engagement_rate, inView, 1600, 2)
  const countB = useCounter(playerB.analytics.engagement_rate, inView, 1600, 2)
  const delta = Math.abs(playerA.analytics.engagement_rate - playerB.analytics.engagement_rate).toFixed(2)
  const aWins = playerA.analytics.engagement_rate >= playerB.analytics.engagement_rate

  return (
    <div className="rounded-lg border border-soft bg-elevated p-6">
      <div className="mb-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Headline Metric</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Engagement Rate</h2>
      </div>

      <div ref={ref} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* A */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">
            {playerA.profile.handle} · ENGAGEMENT RATE
          </span>
          <div
            className="font-sans font-semibold tabular-nums leading-none tracking-tight text-player-a"
            style={{
              fontSize: 'clamp(var(--fs-3xl), 6vw, var(--fs-4xl))',
              textShadow: '0 0 60px var(--player-a-glow)',
            }}
          >
            {countA}%
          </div>
          <span className={`font-mono text-sm tabular-nums ${aWins ? 'text-success' : 'text-danger'}`}>
            {aWins ? `↑ +${delta}% vs B` : `↓ −${delta}% vs B`}
          </span>
        </div>

        <VsPill />

        {/* B */}
        <div className="flex flex-col items-end gap-2">
          <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">
            ENGAGEMENT RATE · {playerB.profile.handle}
          </span>
          <div
            className="font-sans font-semibold tabular-nums leading-none tracking-tight text-player-b"
            style={{
              fontSize: 'clamp(var(--fs-3xl), 6vw, var(--fs-4xl))',
              textShadow: '0 0 60px var(--player-b-glow)',
            }}
          >
            {countB}%
          </div>
          <span className={`font-mono text-sm tabular-nums ${!aWins ? 'text-success' : 'text-danger'}`}>
            {!aWins ? `↑ +${delta}% vs A` : `↓ −${delta}% vs A`}
          </span>
        </div>
      </div>
    </div>
  )
}
