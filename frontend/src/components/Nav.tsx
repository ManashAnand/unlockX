'use client'
import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : user?.user_metadata?.full_name
      ? (user.user_metadata.full_name as string).split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
      : '?'

  return (
    <nav className="sticky top-0 z-50 border-b border-soft bg-[rgba(7,7,12,0.85)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-8 py-4 max-md:px-4">
        <a href="/" className="font-sans text-lg font-semibold tracking-snug text-primary">
          Unlock
          <span style={{
            background: 'linear-gradient(90deg, var(--player-a), var(--player-b))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>X</span>
        </a>

        <div className="flex items-center gap-3">
          <span className="inline-flex h-[26px] items-center gap-2 rounded-full border border-soft bg-elevated px-3 font-mono text-[11px] uppercase tracking-wide text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            BETA
          </span>

          {user && (
            <a
              href="/comparisons"
              className="font-mono text-[11px] text-tertiary hover:text-secondary transition-colors hidden sm:block"
            >
              My Comparisons
            </a>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border border-soft font-mono text-xs font-medium text-secondary"
                style={{ background: 'var(--bg-elevated)' }}
                title={user.email ?? ''}
              >
                {initials}
              </div>
              <button
                onClick={signOut}
                className="font-mono text-[11px] text-tertiary hover:text-secondary transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-soft bg-transparent px-4 font-mono text-[11px] text-primary hover:-translate-y-px transition-transform"
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
