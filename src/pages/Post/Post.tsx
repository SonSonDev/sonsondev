import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { EditPencil } from 'iconoir-react'
import Button from '../../components/Button/Button'
import { useTranslation } from 'react-i18next'
import { fetchPostBySlug } from '../../firebase/posts'
import { Post as PostType } from '../../types/post'
import { formatDate } from '../../utils/date'
import { useAuth } from '../../context/AuthContext'
import { routes } from '../../routes'
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
      if (!data) { navigate(routes.Home); return }
      setPost(data)
      setLoading(false)
    })
  }, [slug, navigate])

  if (loading) return <p>{t('common.loading')}</p>
  if (!post) return null

  const formattedDate = formatDate(post.createdAt)

  return (
    <article className="post">
      {post.thumbnailUrl && post.showThumbnail && (
        <img src={post.thumbnailUrl} alt="" className="post__thumbnail" />
      )}
      <header className="post__header">
        <span className="post__date">{formattedDate}</span>
        <h1 className="post__title">{post.title}</h1>
        {user && (
          <>
            <span className={`post__badge ${post.published ? 'post__badge--published' : ''}`}>
              {post.published ? t('admin.published') : t('admin.draft')}
            </span>
            <Button as="link" variant="ghost" className="post__edit" to={routes.AdminEditPost(post.id)} aria-label={t('action.edit')}><EditPencil /></Button>
          </>
        )}
      </header>
      <div className="post__content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
