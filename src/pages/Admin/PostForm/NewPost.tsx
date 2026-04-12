import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addPost } from '../../../firebase/posts'
import { PostBase } from '../../../types/post'
import { routes } from '../../../routes'
import PostForm from './PostForm'

export default function NewPost() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSubmit = async (data: PostBase) => {
    await addPost(data)
    navigate(routes.AdminPosts)
  }

  return <PostForm heading={t('admin.new_post')} onSubmit={handleSubmit} />
}
