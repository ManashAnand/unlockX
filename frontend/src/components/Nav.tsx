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
    <nav
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,28,0.92) 0%, rgba(7,7,20,0.80) 100%)',
        borderBottom: '1px solid rgba(100,120,255,0.12)',
        boxShadow: '0 1px 0 rgba(80,100,255,0.08), 0 4px 24px -8px rgba(0,0,0,0.4)',
      }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-8 py-3 max-md:px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img src="/image.png" alt="UnlockX" width={44} height={44} style={{ objectFit: 'contain', display: 'block' }} />
          <span className="font-sans text-lg font-semibold tracking-tight text-primary">
            Unlock
            <span style={{
              background: 'linear-gradient(90deg, #6a9fff, #00d4ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>X</span>
          </span>
        </a>

        <div className="flex items-center gap-2.5">
          {/* Beta pill */}
          <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full border border-soft bg-elevated px-3 font-mono text-[10px] uppercase tracking-wide text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            BETA
          </span>

          {/* My Comparisons pill */}
          {user && (
            <a
              href="/comparisons"
              className="hidden sm:inline-flex h-[26px] items-center gap-1.5 rounded-full border px-3 font-mono text-[10px] uppercase tracking-wide transition-colors hover:border-[rgba(100,160,255,0.35)] hover:text-secondary"
              style={{
                borderColor: 'rgba(100,140,255,0.20)',
                background: 'rgba(80,100,255,0.06)',
                color: 'rgba(150,170,255,0.8)',
              }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
                <rect x="0" y="0" width="4" height="4" rx="1"/>
                <rect x="6" y="0" width="4" height="4" rx="1"/>
                <rect x="0" y="6" width="4" height="4" rx="1"/>
                <rect x="6" y="6" width="4" height="4" rx="1"/>
              </svg>
              My Comparisons
            </a>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(80,100,255,0.15), rgba(0,180,255,0.10))',
                  borderColor: 'rgba(100,140,255,0.25)',
                  color: 'rgba(180,200,255,0.9)',
                }}
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
              className="inline-flex h-[26px] items-center justify-center gap-2 rounded-full px-4 font-mono text-[10px] uppercase tracking-wide text-primary transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, rgba(80,100,255,0.15), rgba(0,160,255,0.10))',
                border: '1px solid rgba(100,140,255,0.25)',
              }}
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
