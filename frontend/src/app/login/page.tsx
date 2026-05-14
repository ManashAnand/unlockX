'use client'
import { createClient } from '@/lib/supabase-client'

export default function LoginPage() {
  const supabase = createClient()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base">
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,124,255,0.18) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,124,77,0.15) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-10 text-center">
          <p className="font-sans text-2xl font-semibold tracking-tight text-primary">
            Unlock
            <span style={{
              background: 'linear-gradient(90deg, var(--player-a), var(--player-b))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>X</span>
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-tertiary">
            Creator Intelligence
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--stroke-soft)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h1 className="mb-1 font-sans text-lg font-semibold text-primary">Sign in</h1>
          <p className="mb-6 text-sm text-secondary">
            Compare any two Twitter creators — free.
          </p>

          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-primary transition-all hover:-translate-y-px hover:border-default active:translate-y-0"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--stroke-default)',
            }}
          >
            {/* Google logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="mt-5 text-center font-mono text-[10px] text-muted">
            By signing in you agree to our terms.
          </p>
        </div>
      </div>
    </div>
  )
}
