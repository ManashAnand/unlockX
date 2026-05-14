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
    await supabase.from('user_comparisons').insert({
      user_id: user.id,
      handle_a: result.a.profile.handle,
      handle_b: result.b.profile.handle,
      name_a: result.a.profile.name,
      name_b: result.b.profile.name,
      followers_a: result.a.profile.followers,
      followers_b: result.b.profile.followers,
      winner_handle: winnerHandle,
      total_followers: result.a.profile.followers + result.b.profile.followers,
    })
  } catch {
    // silent — saving is best-effort
  }
}

export function useCompare() {
  const [state, setState] = useState<CompareState>(initial)
  const closeRef = useRef<(() => void) | null>(null)

  const compare = useCallback((handleA: string, handleB: string) => {
    if (closeRef.current) closeRef.current()
    setState({ ...initial, step: 'scraping_a', message: `Fetching ${handleA}…` })

    const close = streamCompare(
      handleA,
      handleB,
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
