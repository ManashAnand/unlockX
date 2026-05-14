'use client'
import Card from './Card'
import { useInView } from '@/hooks/useInView'
import { useCounter } from '@/hooks/useCounter'
import type { PlayerData } from '@/lib/types'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

type Props = { side: 'a' | 'b'; player: PlayerData }

export default function ProfileCard({ side, player }: Props) {
  const { ref, inView } = useInView()
  const followers = useCounter(player.profile.followers, inView, 1400, 0)
  const isA = side === 'a'
  const playerColor = isA ? 'text-player-a' : 'text-player-b'
  const avatarGlow = isA ? 'var(--glow-a)' : 'var(--glow-b)'
  const avatarGrad = isA
    ? 'linear-gradient(135deg, color-mix(in oklch, var(--player-a), black 20%), color-mix(in oklch, var(--player-a), black 50%))'
    : 'linear-gradient(135deg, color-mix(in oklch, var(--player-b), black 20%), color-mix(in oklch, var(--player-b), black 50%))'

  const p = player.profile
  const a = player.analytics

  return (
    <Card side={side} className="animate-fade-up">
      <div ref={ref} className={`flex flex-col gap-4 ${isA ? 'items-start' : 'items-end'}`}>
        {/* Avatar + name */}
        <div className={`flex items-center gap-3 ${isA ? 'flex-row' : 'flex-row-reverse'}`}>
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border text-lg font-semibold text-primary"
            style={{
              background: avatarGrad,
              boxShadow: avatarGlow,
              borderColor: isA ? 'var(--player-a-edge)' : 'var(--player-b-edge)',
            }}
          >
            {p.initials}
          </div>
          <div className={isA ? 'text-left' : 'text-right'}>
            <div className="flex items-center gap-1.5">
              {!isA && p.verified && <span className="font-mono text-xs text-warning">✓</span>}
              <span className="font-sans text-md font-semibold text-primary">{p.name}</span>
              {isA && p.verified && <span className="font-mono text-xs text-warning">✓</span>}
            </div>
            <span className={`font-mono text-sm ${playerColor}`}>{p.handle}</span>
          </div>
        </div>

        {/* Bio */}
        <p className={`text-sm text-secondary leading-relaxed ${isA ? 'text-left' : 'text-right'}`}>
          {p.bio}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-faint" />

        {/* Quick stats */}
        <div className={`flex w-full gap-6 ${isA ? 'justify-start' : 'justify-end'}`}>
          {[
            { label: 'FOLLOWERS', value: followers },
            { label: 'FOLLOWING', value: fmt(p.following) },
            { label: 'POSTS', value: fmt(p.posts) },
          ].map(({ label, value }) => (
            <div key={label} className={isA ? 'text-left' : 'text-right'}>
              <div className="font-mono text-[11px] uppercase tracking-widest text-tertiary">{label}</div>
              <div className={`font-sans text-xl font-semibold tabular-nums leading-tight tracking-tight ${playerColor}`}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Engagement rate quick badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-elevated px-3 py-1">
          <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Engagement</span>
          <span className={`font-mono text-sm tabular-nums font-medium ${playerColor}`}>
            {a.engagement_rate.toFixed(2)}%
          </span>
        </div>
      </div>
    </Card>
  )
}
