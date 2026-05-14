'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Nav from '@/components/Nav'
import ComparisonCard, { type ComparisonRow } from '@/components/ComparisonCard'

export default function ComparisonsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<ComparisonRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('user_comparisons')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setRows(data ?? [])
      setLoading(false)
    })
  }, [supabase])

  return (
    <div className="min-h-screen bg-base">
      <Nav />
      <main className="mx-auto max-w-[1320px] px-8 pb-20 pt-10 max-md:px-4">

        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-tertiary">History</p>
          <h1 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-primary">My Comparisons</h1>
          <p className="mt-1 font-mono text-xs text-tertiary">Click any card to re-run the comparison</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl border border-soft bg-card animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 text-4xl opacity-30">📊</div>
            <p className="font-mono text-sm text-tertiary">No comparisons yet.</p>
            <p className="mt-1 font-mono text-xs text-muted">Run your first comparison to see it here.</p>
            <a
              href="/"
              className="mt-6 inline-flex h-9 items-center gap-2 rounded-full border border-soft px-5 font-mono text-xs text-primary hover:-translate-y-px transition-transform"
              style={{ background: 'var(--bg-elevated)' }}
            >
              Compare creators →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <ComparisonCard key={row.id} row={row} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
