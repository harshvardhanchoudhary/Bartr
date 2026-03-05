import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * /profile — redirects to the logged-in user's profile
 * or to login if not authenticated
 */
export default async function MyProfileRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select('handle')
    .eq('id', user.id)
    .single()

  if (!profile?.handle) redirect('/profile/setup')

  redirect(`/profile/${profile.handle}`)
}
