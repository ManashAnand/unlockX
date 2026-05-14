'use client'
import { useState, useEffect } from 'react'
import VsPill from './VsPill'

type Props = {
  onCompare: (handleA: string, handleB: string) => void
  isLoading: boolean
  defaultA?: string
  defaultB?: string
  autoTrigger?: boolean
}

export default function CompareBar({ onCompare, isLoading, defaultA = '', defaultB = '', autoTrigger = false }: Props) {
  const [handleA, setHandleA] = useState(defaultA)
  const [handleB, setHandleB] = useState(defaultB)
  const [triggered, setTriggered] = useState(false)

  // Sync when defaults arrive (e.g. from URL params)
  useEffect(() => { if (defaultA) setHandleA(defaultA) }, [defaultA])
  useEffect(() => { if (defaultB) setHandleB(defaultB) }, [defaultB])

  // Auto-trigger once when both defaults are set
  useEffect(() => {
    if (autoTrigger && defaultA && defaultB && !triggered) {
      setTriggered(true)
      onCompare(defaultA, defaultB)
    }
  }, [autoTrigger, defaultA, defaultB, triggered, onCompare])

  function submit() {
    if (!handleA.trim() || !handleB.trim() || isLoading) return
    onCompare(handleA.trim(), handleB.trim())
  }

  return (
    <div className="rounded-xl border border-soft bg-elevated p-4">
      <div className="flex flex-wrap items-center gap-3">
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
