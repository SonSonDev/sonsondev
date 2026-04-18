'use client'

import { useAdminPost } from '@/hooks/useAdminPost'
import PostContent from '@/views/Post/PostContent'
import Loader from '@/components/ui/Loader'

export default function AdminViewPostPage() {
  const { post } = useAdminPost()

  if (!post) return <Loader />

  return <PostContent post={{ ...post, createdAt: post.createdAt.toISOString() }} />
}
