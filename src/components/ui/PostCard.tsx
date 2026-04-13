import Link from 'next/link'
import { Post } from '@/types/post'
import { formatDate } from '@/utils/date'
import { routes } from '@/routes'
import { t } from '@/locales/t'
import '@/assets/stylesheets/post-card.scss'

interface Props {
  post: Post
}

export default function PostCard({ post }: Props) {
  const formattedDate = formatDate(post.createdAt)

  return (
    <article className="post-card">
      {post.thumbnailUrl && (
        <img src={post.thumbnailUrl} alt="" className="post-card__thumbnail" />
      )}
      <div className="post-card__body">
        <span className="post-card__date">{formattedDate}</span>
        <h2 className="post-card__title">{post.title}</h2>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <Link href={routes.Post(post.slug)} className="post-card__link">
          {t('action.read_more')}
        </Link>
      </div>
    </article>
  )
}
