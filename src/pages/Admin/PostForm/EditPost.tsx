import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchPostById, updatePost } from '../../../firebase/posts'
import { PostBase } from '../../../types/post'
import { routes } from '../../../routes'
import PostForm from './PostForm'

export default function EditPost() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<PostBase | null>(null)

  useEffect(() => {
    fetchPostById(id!).then(post => {
      if (!post) { navigate(routes.AdminPosts); return }
      const { title, slug, excerpt, content, published, thumbnailUrl, showThumbnail } = post
      setInitialValues({ title, slug, excerpt, content, published, thumbnailUrl, showThumbnail })
    })
  }, [id, navigate])

  const handleSubmit = async (data: PostBase) => {
    await updatePost(id!, data)
    navigate(routes.AdminPosts)
  }

  if (!initialValues) return <p>{t('common.loading')}</p>

  return <PostForm heading={t('admin.edit_post')} initialValues={initialValues} onSubmit={handleSubmit} preview />
}
