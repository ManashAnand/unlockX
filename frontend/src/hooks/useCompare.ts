'use client'
import { useState, useCallback, useRef } from 'react'
import { streamCompare } from '@/lib/api'
import { createClient } from '@/lib/supabase-client'
import type { CompareState, PlayerData, CompareResult } from '@/lib/types'

const initial: CompareState = {
  step: 'idle',
  message: '',
  playerA: null,
  playerB: null,
  result: null,
  error: null,
}

function determineWinner(result: CompareResult): string {
  const keys: Array<keyof typeof result.a.analytics> = [
    'engagement_rate', 'avg_likes', 'avg_retweets', 'avg_replies',
    'posting_frequency', 'consistency_score', 'reply_ratio',
  ]
  let winsA = 0, winsB = 0
  for (const k of keys) {
    const va = result.a.analytics[k] as number
    const vb = result.b.analytics[k] as number
    if (va > vb) winsA++; else if (vb > va) winsB++
  }
  return winsA >= winsB ? result.a.profile.handle : result.b.profile.handle
}

async function saveComparison(result: CompareResult) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const winnerHandle = determineWinner(result)

    // Normalize order: always store handles sorted alphabetically
    // so "A vs B" and "B vs A" resolve to the same row
    const [pa, pb] = [result.a, result.b].sort((x, y) =>
      x.profile.handle.toLowerCase().localeCompare(y.profile.handle.toLowerCase())
    )

    await supabase.from('user_comparisons').upsert({
      user_id: user.id,
      handle_a: pa.profile.handle,
      handle_b: pb.profile.handle,
      name_a: pa.profile.name,
      name_b: pb.profile.name,
      followers_a: pa.profile.followers,
      followers_b: pb.profile.followers,
      winner_handle: winnerHandle,
      total_followers: pa.profile.followers + pb.profile.followers,
    }, { onConflict: 'user_id,handle_a,handle_b' })
  } catch {
    // silent — saving is best-effort
  }
}

export function useCompare() {
  const [state, setState] = useState<CompareState>(initial)
  const closeRef = useRef<(() => void) | null>(null)

  const compare = useCallback((handleA: string, handleB: string, maxPosts = 20) => {
    if (closeRef.current) closeRef.current()
    setState({ ...initial, step: 'scraping_a', message: `Fetching ${handleA}…` })

    const close = streamCompare(
      handleA,
      handleB,
      maxPosts,
      (event, data) => {
        const d = data as Record<string, unknown>
        if (event === 'status') {
          setState((s) => ({
            ...s,
            step: (d.step as CompareState['step']) ?? s.step,
            message: (d.message as string) ?? s.message,
          }))
        } else if (event === 'profile') {
          const side = d.side as 'a' | 'b'
          const player = d.data as PlayerData
          setState((s) => ({
            ...s,
            playerA: side === 'a' ? player : s.playerA,
            playerB: side === 'b' ? player : s.playerB,
          }))
        } else if (event === 'complete') {
          const result = d as unknown as CompareResult
          setState((s) => ({ ...s, step: 'complete', result }))
          saveComparison(result)
        }
      },
      () => {},
      (err) => setState((s) => ({ ...s, step: 'error', error: err })),
    )
    closeRef.current = close
  }, [])

  return { state, compare }
}
