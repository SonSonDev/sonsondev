import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addPost } from '../../../firebase/posts'
import { PostBase } from '../../../types/post'
import ArticleForm from '../ArticleForm/ArticleForm'

export default function NewArticle() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSubmit = async (data: PostBase) => {
    await addPost(data)
    navigate('/admin/articles')
  }

  return <ArticleForm heading={t('admin.newArticle')} onSubmit={handleSubmit} />
}
