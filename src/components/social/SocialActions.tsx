'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  postId: string
  likeCount: number
  commentCount: number
  listingId?: string | null
}

export function SocialActions({ postId, likeCount, commentCount, listingId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [likes, setLikes] = useState(likeCount)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  async function handleLike() {
    if (liking) return
    setLiking(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?next=/social')
      setLiking(false)
      return
    }

    if (liked) {
      // Unlike
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
      await supabase.from('social_posts').update({ like_count: Math.max(0, likes - 1) }).eq('id', postId)
      setLikes(prev => Math.max(0, prev - 1))
      setLiked(false)
    } else {
      // Like
      await supabase.from('post_likes').upsert({ post_id: postId, user_id: user.id })
      await supabase.from('social_posts').update({ like_count: likes + 1 }).eq('id', postId)
      setLikes(prev => prev + 1)
      setLiked(true)
    }

    setLiking(false)
  }

  return (
    <div className="flex items-center gap-1 px-4 pb-4 pt-1 border-t border-stroke">
      <button
        onClick={handleLike}
        className="btn btn-ghost text-xs px-3 py-1.5 gap-1.5 transition-colors"
        style={liked ? { color: 'var(--red)' } : {}}
      >
        <span>{liked ? '♥' : '♡'}</span>
        <span className="font-mono">{likes}</span>
      </button>
      <button className="btn btn-ghost text-xs px-3 py-1.5 gap-1.5 cursor-default">
        <span>◻</span>
        <span className="font-mono">{commentCount}</span>
      </button>
      {listingId && (
        <a
          href={`/listings/${listingId}`}
          className="btn btn-ghost text-xs px-3 py-1.5 ml-auto"
        >
          View listing →
        </a>
      )}
    </div>
  )
}
