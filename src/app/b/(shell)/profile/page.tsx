import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function BProfileRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/b/profile')

  const { data: profile } = await supabase
    .from('profiles')
    .select('handle')
    .eq('id', user.id)
    .single()

  if (!profile?.handle) redirect('/profile/setup')

  redirect(`/b/profile/${profile.handle}`)
}
