import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Post } from '../types/post'
import { formatDate } from '../utils/date'
import './PostCard.scss'

interface Props {
  post: Post
}

export default function PostCard({ post }: Props) {
  const { t } = useTranslation()
  const formattedDate = formatDate(post.createdAt)

  return (
    <article className="post-card">
      <span className="post-card__date">{formattedDate}</span>
      <h2 className="post-card__title">
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="post-card__excerpt">{post.excerpt}</p>
      <Link to={`/post/${post.slug}`} className="post-card__link">
        {t('action.readMore')}
      </Link>
    </article>
  )
}
