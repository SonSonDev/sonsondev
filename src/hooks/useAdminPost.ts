'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { fetchPostById } from '@/firebase/posts'
import { Post } from '@/types/post'
import { routes } from '@/routes'

export function useAdminPost() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    if (!id) { router.push(routes.AdminPost); return }
    fetchPostById(id).then(p => {
      if (!p) { router.push(routes.AdminPost); return }
      setPost(p)
    })
  }, [id, router])

  return { id, post }
}
