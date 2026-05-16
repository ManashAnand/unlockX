'use client'
import { useState, useEffect } from 'react'
import VsPill from './VsPill'

const POST_OPTIONS = [20, 50, 100] as const
type PostCount = typeof POST_OPTIONS[number]

type Props = {
  onCompare: (handleA: string, handleB: string, maxPosts: number) => void
  isLoading: boolean
  defaultA?: string
  defaultB?: string
  autoTrigger?: boolean
}

export default function CompareBar({ onCompare, isLoading, defaultA = '', defaultB = '', autoTrigger = false }: Props) {
  const [handleA, setHandleA] = useState(defaultA)
  const [handleB, setHandleB] = useState(defaultB)
  const [maxPosts, setMaxPosts] = useState<PostCount>(20)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => { if (defaultA) setHandleA(defaultA) }, [defaultA])
  useEffect(() => { if (defaultB) setHandleB(defaultB) }, [defaultB])

  useEffect(() => {
    if (autoTrigger && defaultA && defaultB && !triggered) {
      setTriggered(true)
      onCompare(defaultA, defaultB, maxPosts)
    }
  }, [autoTrigger, defaultA, defaultB, triggered, onCompare, maxPosts])

  function submit() {
    if (!handleA.trim() || !handleB.trim() || isLoading) return
    onCompare(handleA.trim(), handleB.trim(), maxPosts)
  }

  return (
    <div
      className="rounded-xl border border-soft p-4"
      style={{ background: 'rgba(10,10,25,0.6)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Handle A */}
        <div className="min-w-0 flex-1">
          <input
            value={handleA}
            onChange={(e) => setHandleA(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="@handle_a"
            disabled={isLoading}
            className="h-12 w-full rounded-full border border-soft bg-input px-5 font-sans text-base text-primary placeholder:text-muted outline-none transition-[border-color,background] duration-fast ease-out focus:border-[var(--player-a-edge)] focus:bg-card disabled:opacity-50"
          />
        </div>

        <VsPill />

        {/* Handle B */}
        <div className="min-w-0 flex-1">
          <input
            value={handleB}
            onChange={(e) => setHandleB(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="@handle_b"
            disabled={isLoading}
            className="h-12 w-full rounded-full border border-soft bg-input px-5 font-sans text-base text-primary placeholder:text-muted outline-none transition-[border-color,background] duration-fast ease-out focus:border-[var(--player-b-edge)] focus:bg-card disabled:opacity-50"
          />
        </div>

        {/* Post count segmented control */}
        <div
          className="flex items-center gap-0.5 rounded-full border border-soft p-1"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          {POST_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setMaxPosts(n)}
              disabled={isLoading}
              title={`Analyse last ${n} posts`}
              className="h-8 rounded-full px-3 font-mono text-[11px] transition-all duration-150 disabled:opacity-40 cursor-pointer"
              style={maxPosts === n ? {
                background: 'rgba(100,140,255,0.18)',
                color: 'rgba(160,190,255,0.95)',
                border: '1px solid rgba(100,140,255,0.30)',
              } : {
                color: 'var(--text-muted)',
                border: '1px solid transparent',
              }}
            >
              {n}
            </button>
          ))}
          <span className="font-mono text-[10px] text-muted pr-2 pl-1 select-none">posts</span>
        </div>

        {/* Compare button */}
        <button
          onClick={submit}
          disabled={isLoading || !handleA.trim() || !handleB.trim()}
          className="h-12 rounded-full bg-accent px-6 font-sans text-sm font-medium text-on-accent transition-[transform,opacity] duration-fast ease-out hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ boxShadow: 'var(--glow-accent)' }}
        >
          {isLoading ? 'Analyzing…' : 'Compare'}
        </button>
      </div>
    </div>
  )
}
