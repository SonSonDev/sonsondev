'use client'

import { useTranslation } from 'react-i18next'
import { updatePost } from '@/firebase/posts'
import { PostBase } from '@/types/post'
import { useAdminPost } from '@/hooks/useAdminPost'
import PostForm from '@/views/Admin/PostForm/PostForm'
import Loader from '@/components/ui/Loader'

export default function EditPostPage() {
  const { t } = useTranslation()
  const { id, post } = useAdminPost()

  const handleSubmit = async (data: PostBase) => {
    await updatePost(id, data)
  }

  if (!post) return <Loader />

  const { title, slug, excerpt, content, published, thumbnailUrl, showThumbnail, tagIds } = post
  return (
    <PostForm
      heading={t('admin.edit_post')}
      initialValues={{ title, slug, excerpt, content, published, thumbnailUrl, showThumbnail, tagIds }}
      onSubmit={handleSubmit}
      preview
    />
  )
}
