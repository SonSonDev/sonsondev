'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { fetchPostById, updatePost } from '@/firebase/posts'
import { PostBase } from '@/types/post'
import { routes } from '@/routes'
import PostForm from '@/views/Admin/PostForm/PostForm'

export default function EditPostPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [initialValues, setInitialValues] = useState<PostBase | null>(null)

  useEffect(() => {
    fetchPostById(id!).then(post => {
      if (!post) { router.push(routes.AdminPost); return }
      const { title, slug, excerpt, content, published, thumbnailUrl, showThumbnail } = post
      setInitialValues({ title, slug, excerpt, content, published, thumbnailUrl, showThumbnail })
    })
  }, [id, router])

  const handleSubmit = async (data: PostBase) => {
    await updatePost(id!, data)
    router.push(routes.AdminPost)
  }

  if (!initialValues) return <p>{t('common.loading')}</p>

  return <PostForm heading={t('admin.edit_post')} initialValues={initialValues} onSubmit={handleSubmit} preview />
}
