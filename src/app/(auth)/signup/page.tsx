// Signup is the same flow as login (magic link) — redirect there with a signup flag
import { redirect } from 'next/navigation'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  redirect(`/login${searchParams.next ? `?next=${searchParams.next}` : ''}`)
}
