import type { ReactNode } from 'react'

type Props = {
  side?: 'a' | 'b'
  className?: string
  children: ReactNode
}

export default function Card({ side, className = '', children }: Props) {
  const base = 'rounded-lg border p-6 transition-[border-color] duration-base ease-out'

  if (side === 'a') {
    return (
      <div
        className={`${base} border-player-a-edge shadow-card shadow-glow-a ${className}`}
        style={{
          background: 'radial-gradient(120% 80% at 0% 0%, var(--player-a-soft), transparent 60%), var(--bg-card)',
          boxShadow: 'var(--shadow-card), var(--glow-a)',
        }}
      >
        {children}
      </div>
    )
  }

  if (side === 'b') {
    return (
      <div
        className={`${base} border-player-b-edge ${className}`}
        style={{
          background: 'radial-gradient(120% 80% at 100% 0%, var(--player-b-soft), transparent 60%), var(--bg-card)',
          boxShadow: 'var(--shadow-card), var(--glow-b)',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={`${base} border-soft bg-card shadow-card ${className}`}>
      {children}
    </div>
  )
}
