'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function LoginPage() {
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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    })

    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${next}`,
      },
    })
    if (error) toast.error(error.message)
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        background: `radial-gradient(800px 500px at 50% -10%, rgba(200,53,42,0.12), transparent 60%),
                     linear-gradient(180deg, #08090c, #0a0a0a)`,
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-4xl tracking-[0.15em] text-white">
            BARTR
          </Link>
          <p className="text-muted text-sm mt-2">
            {next !== '/browse' ? 'Sign in to continue' : 'Sign in to your account'}
          </p>
        </div>

        {sent ? (
          <div className="card p-6 text-center">
            <div className="text-3xl mb-3">✉</div>
            <h2 className="font-semibold mb-2">Check your email</h2>
            <p className="text-muted text-sm">
              We sent a magic link to <strong>{email}</strong>.
              Click it to sign in — no password needed.
            </p>
            <button
              onClick={() => setSent(false)}
              className="btn btn-ghost mt-4 text-sm w-full"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="card p-6">
            {/* Magic link */}
            <form onSubmit={handleMagicLink} className="space-y-3 mb-4">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="btn btn-primary w-full"
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-stroke" />
              <span className="text-xs text-muted-2 font-mono">or</span>
              <div className="flex-1 h-px bg-stroke" />
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogle}
              className="btn w-full gap-2 justify-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        <p className="text-center text-xs text-muted-2 mt-6">
          By continuing you agree to our{' '}
          <Link href="/legal/terms" className="underline hover:text-muted">Terms</Link>
          {' '}and{' '}
          <Link href="/legal/privacy" className="underline hover:text-muted">Privacy Policy</Link>
        </p>

        {/* Earn-the-signup: browse first */}
        <div className="text-center mt-4">
          <Link href="/browse" className="text-xs text-muted hover:text-text transition-colors">
            ← Browse listings without signing in
          </Link>
        </div>
      </div>
    </main>
  )
}
