'use client'
import { useEffect, useState } from 'react'
import MirrorGrid from './MirrorGrid'
import Card from './Card'
import { useInView } from '@/hooks/useInView'
import type { PlayerData, ToneItem } from '@/lib/types'

function ToneColumn({ items, side }: { items: ToneItem[]; side: 'a' | 'b' }) {
  const { ref, inView } = useInView()
  const [active, setActive] = useState(false)
  const color = side === 'a' ? 'text-player-a' : 'text-player-b'

  useEffect(() => {
    if (inView) { const t = setTimeout(() => setActive(true), 80); return () => clearTimeout(t) }
  }, [inView])

  return (
    <Card side={side}>
      <div ref={ref} className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">{item.label}</span>
              <span className={`font-mono text-xs tabular-nums ${color}`}>{item.value}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-elevated">
              <span
                className={`${side === 'a' ? 'bar-fill-a' : 'bar-fill-b'} absolute left-0 top-0 h-full rounded-full transition-[width] duration-slower ease-out`}
                style={{ width: active ? `${item.value}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

type Props = { playerA: PlayerData; playerB: PlayerData }

export default function ToneBreakdown({ playerA, playerB }: Props) {
  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Analysis</span>
        <h2 className="mt-1 font-sans text-md font-semibold tracking-snug text-primary">Content Tone</h2>
      </div>
      <MirrorGrid>
        <ToneColumn items={playerA.tone} side="a" />
        <ToneColumn items={playerB.tone} side="b" />
      </MirrorGrid>
    </div>
  )
}
