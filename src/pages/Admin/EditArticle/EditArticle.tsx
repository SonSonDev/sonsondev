import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchPostById, updatePost } from '../../../firebase/posts'
import { PostBase } from '../../../types/post'
import ArticleForm from '../ArticleForm/ArticleForm'

export default function EditArticle() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState<PostBase | null>(null)

  useEffect(() => {
    fetchPostById(id!).then(post => {
      if (!post) { navigate('/admin/articles'); return }
      const { title, slug, excerpt, content, published } = post
      setInitialValues({ title, slug, excerpt, content, published })
    })
  }, [id, navigate])

  const handleSubmit = async (data: PostBase) => {
    await updatePost(id!, data)
    navigate('/admin/articles')
  }

  if (!initialValues) return <p>{t('common.loading')}</p>

  return <ArticleForm heading={t('admin.editArticle')} initialValues={initialValues} onSubmit={handleSubmit} preview />
}
