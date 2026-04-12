import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { fetchPostBySlug } from '../firebase/posts'
import { Post as PostType } from '../types/post'
import { formatDate } from '../utils/date'
import './Post.scss'

export default function Post() {
  const { t } = useTranslation()
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPostBySlug(slug!).then(data => {
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
      </header>
      <div className="post__content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
