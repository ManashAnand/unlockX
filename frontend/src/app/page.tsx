'use client'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import Nav from '@/components/Nav'
import CompareBar from '@/components/CompareBar'
import MirrorGrid from '@/components/MirrorGrid'
import ProfileCard from '@/components/ProfileCard'
import HeroMetric from '@/components/HeroMetric'
import CompareTable from '@/components/CompareTable'
import TopPosts from '@/components/TopPosts'
import ToneBreakdown from '@/components/ToneBreakdown'
import TopicDistribution from '@/components/TopicDistribution'
import AIInsights from '@/components/AIInsights'
import VerdictBanner from '@/components/VerdictBanner'
import LoadingState from '@/components/LoadingState'
import GrowthChart from '@/components/GrowthChart'
import ComparisonCard, { type ComparisonRow } from '@/components/ComparisonCard'
import { useCompare } from '@/hooks/useCompare'
import { createClient } from '@/lib/supabase-client'
import type { PlayerData } from '@/lib/types'

const GridScan = dynamic(() => import('@/components/GridScan').then((m) => ({ default: m.GridScan })), {
  ssr: false,
  loading: () => null,
})

function PostsBanner({ playerA, playerB }: { playerA: PlayerData; playerB: PlayerData }) {
  const countA = playerA.analytics.tweet_count
  const countB = playerB.analytics.tweet_count
  const sameCount = countA === countB

  return (
    <div
      className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-center"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="font-mono text-[11px] text-tertiary">
        {sameCount ? (
          <>Analysis based on each creator&apos;s last <span className="text-secondary font-medium">{countA}</span> posts</>
        ) : (
          <>
            Analysis based on{' '}
            <span style={{ color: 'var(--player-a)' }}>{playerA.profile.handle}</span>&apos;s last{' '}
            <span className="text-secondary font-medium">{countA}</span> posts &amp;{' '}
            <span style={{ color: 'var(--player-b)' }}>{playerB.profile.handle}</span>&apos;s last{' '}
            <span className="text-secondary font-medium">{countB}</span> posts
          </>
        )}
      </p>
    </div>
  )
}

function TopComparisons() {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<ComparisonRow[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase
      .from('user_comparisons')
      .select('*')
      .order('total_followers', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setRows(data ?? [])
        setLoaded(true)
      })
  }, [supabase])

  if (!loaded || rows.length === 0) return null

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-tertiary">Trending</span>
        <div className="flex-1 h-px bg-soft opacity-30" />
      </div>
      <p className="mb-5 font-sans text-sm font-medium text-secondary">Top Comparisons by Reach</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((row, i) => (
          <ComparisonCard key={row.id} row={row} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}

function HomeInner() {
  const { state, compare } = useCompare()
  const isLoading = !['idle', 'complete', 'error'].includes(state.step)
  const params = useSearchParams()
  const defaultA = params.get('a') ?? ''
  const defaultB = params.get('b') ?? ''
  const autoTrigger = Boolean(defaultA && defaultB)

  return (
    <div className="min-h-screen bg-base">
      <Nav />
      <main className="mx-auto max-w-[1320px] px-8 pb-20 pt-8 max-md:px-4">

        {/* Idle state */}
        {state.step === 'idle' && (
          <>
            <div
              className="relative mb-8 rounded-2xl overflow-hidden"
              style={{ minHeight: '260px' }}
            >
              <div className="absolute inset-0 z-0">
                <GridScan
                  sensitivity={0.4}
                  lineThickness={1}
                  linesColor="#1a1a2e"
                  gridScale={0.12}
                  scanColor="#7c7cff"
                  scanOpacity={0.45}
                  enablePost
                  bloomIntensity={0.35}
                  chromaticAberration={0.0015}
                  noiseIntensity={0.006}
                  scanGlow={0.6}
                  scanSoftness={2.5}
                  scanDuration={2.5}
                  scanDelay={2.0}
                  scanDirection="pingpong"
                  className=""
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center py-14 text-center">
                <p className="font-mono text-[11px] uppercase tracking-widest text-tertiary mb-3">
                  Creator Intelligence
                </p>
                <h1 className="font-sans text-3xl font-semibold tracking-tight text-primary">
                  Twitter Creator Intelligence
                </h1>
                <p className="mt-2 text-base text-secondary max-w-md mx-auto">
                  Enter two handles. Get an AI breakdown of who grows faster — and why.
                </p>
              </div>
            </div>

            <CompareBar
              onCompare={compare}
              isLoading={isLoading}
              defaultA={defaultA}
              defaultB={defaultB}
              autoTrigger={autoTrigger}
            />

            <TopComparisons />
          </>
        )}

        {/* CompareBar when not idle */}
        {state.step !== 'idle' && (
          <CompareBar
            onCompare={compare}
            isLoading={isLoading}
            defaultA={defaultA}
            defaultB={defaultB}
          />
        )}

        {/* Loading */}
        {isLoading && <LoadingState message={state.message} step={state.step} />}

        {/* Error */}
        {state.step === 'error' && (
          <div className="mt-8 rounded-lg border border-danger bg-card p-6 text-center">
            <p className="font-mono text-sm text-danger">{state.error}</p>
          </div>
        )}

        {/* Results */}
        {(state.playerA || state.playerB) && (
          <div className="mt-8 space-y-8">
            <MirrorGrid>
              {state.playerA ? (
                <ProfileCard side="a" player={state.playerA} />
              ) : (
                <div className="rounded-lg border border-soft bg-card p-6 animate-pulse h-48" />
              )}
              {state.playerB ? (
                <ProfileCard side="b" player={state.playerB} />
              ) : (
                <div className="rounded-lg border border-soft bg-card p-6 animate-pulse h-48" />
              )}
            </MirrorGrid>

            {state.playerA && state.playerB && (
              <>
                <PostsBanner playerA={state.playerA} playerB={state.playerB} />
                <HeroMetric playerA={state.playerA} playerB={state.playerB} />
                <GrowthChart playerA={state.playerA} playerB={state.playerB} />
                <CompareTable playerA={state.playerA} playerB={state.playerB} />
                <TopPosts playerA={state.playerA} playerB={state.playerB} />
                <ToneBreakdown playerA={state.playerA} playerB={state.playerB} />
                <TopicDistribution playerA={state.playerA} playerB={state.playerB} />
              </>
            )}

            {state.result && (
              <>
                <AIInsights
                  insights={state.result.ai_insights}
                  playerA={state.result.a}
                  playerB={state.result.b}
                />
                <VerdictBanner result={state.result} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  )
}
