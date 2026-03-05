'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/browse'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
    if (error) { toast.error(error.message) }
    else { setSent(true) }
    setLoading(false)
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
    if (error) toast.error(error.message)
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 28,
            color: 'var(--ink)', textDecoration: 'none',
          }}>
            Bartr
          </Link>
          <p style={{ marginTop: 6, fontSize: 14, color: 'var(--muted)' }}>
            {next !== '/browse' ? 'Sign in to continue' : 'Welcome back'}
          </p>
        </div>

        {/* Progress pip — step 1 of 2 */}
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 28 }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: i === 0 ? 20 : 8, height: 4,
              borderRadius: 99,
              background: i === 0 ? 'var(--red)' : 'var(--brd2)',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>

        {sent ? (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '28px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
            <h2 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
              We sent a magic link to <strong style={{ color: 'var(--ink)' }}>{email}</strong>.
              Click it to sign in — no password needed.
            </p>
            <button
              onClick={() => setSent(false)}
              style={{
                marginTop: 20, width: '100%', padding: '12px',
                border: '1px solid var(--brd)', borderRadius: 99,
                background: 'transparent', color: 'var(--ink2)',
                fontSize: 14, cursor: 'pointer',
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '24px',
          }}>
            {/* Magic link form */}
            <form onSubmit={handleMagicLink} style={{ marginBottom: 16 }}>
              <label className="label" htmlFor="email" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, display: 'block' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
                className="input"
                style={{ marginBottom: 12 }}
              />
              <button
                type="submit"
                disabled={loading || !email}
                style={{
                  width: '100%', padding: '13px',
                  borderRadius: 99,
                  background: !email || loading ? 'var(--brd2)' : 'var(--red)',
                  color: 'white', border: '1px solid transparent',
                  fontSize: 15, fontWeight: 500, cursor: !email || loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {loading ? 'Sending…' : 'Send magic link →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--brd)' }} />
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--brd)' }} />
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              style={{
                width: '100%', padding: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: '1px solid var(--brd2)', borderRadius: 99,
                background: 'var(--surf)', color: 'var(--ink2)',
                fontSize: 14, cursor: 'pointer',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* Legal */}
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--faint)', marginTop: 20, lineHeight: 1.6 }}>
          By continuing you agree to our{' '}
          <Link href="/legal/terms" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/legal/privacy" style={{ color: 'var(--muted)', textDecoration: 'underline' }}>Privacy Policy</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/browse" style={{ fontSize: 12, color: 'var(--faint)', textDecoration: 'none' }}>
            ← Browse without signing in
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
