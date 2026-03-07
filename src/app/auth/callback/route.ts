import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/browse'

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Ensure a profile row exists — creates on first login, no-op on subsequent ones.
      // Without this, any DB write that foreign-keys to profiles fails with a constraint error.
      const base = (user.email?.split('@')[0] ?? 'user')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase()
        .slice(0, 18) || 'user'
      const handle = `${base}${Math.floor(Math.random() * 9000) + 1000}`

      await supabase.from('profiles').upsert(
        {
          id: user.id,
          handle,
          display_name: (user.user_metadata?.full_name as string | undefined) ?? null,
          avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
