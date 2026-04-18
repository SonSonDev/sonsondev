'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { addPost } from '@/firebase/posts'
import { PostBase } from '@/types/post'
import { routes } from '@/routes'
import PostForm from '@/views/Admin/PostForm/PostForm'

export default function NewPostPage() {
  const { t } = useTranslation()
  const router = useRouter()

  const handleSubmit = async (data: PostBase) => {
    const id = await addPost(data)
    router.push(routes.AdminEditPost(id))
  }

  return <PostForm heading={t('admin.new_post')} onSubmit={handleSubmit} />
}
