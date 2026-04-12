import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { fetchPostBySlug } from '../../firebase/posts'
import { Post as PostType } from '../../types/post'
import { formatDate } from '../../utils/date'
import { useAuth } from '../../context/AuthContext'
import './Post.scss'

export default function Post() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPostBySlug(slug!, !user).then(data => {
      if (!data) { navigate('/'); return }
      setPost(data)
      setLoading(false)
    })
  }, [slug, navigate])

  if (loading) return <p>{t('common.loading')}</p>
  if (!post) return null

  const formattedDate = formatDate(post.createdAt)

  return (
    <article className="post">
      <header className="post__header">
        <span className="post__date">{formattedDate}</span>
        <h1 className="post__title">{post.title}</h1>
        {user && (
          <span className={`post__badge ${post.published ? 'post__badge--published' : ''}`}>
            {post.published ? t('admin.published') : t('admin.draft')}
          </span>
        )}
      </header>
      <div className="post__content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
