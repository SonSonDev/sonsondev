'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { SerializedPost } from '@/types/post'
import { formatDate } from '@/utils/date'
import { routes } from '@/routes'
import '@/assets/stylesheets/post-card.scss'

interface Props {
  post: SerializedPost
}

export default function PostCard({ post }: Props) {
  const { t } = useTranslation()
  const formattedDate = formatDate(new Date(post.createdAt))

  return (
    <article className="post-card">
      {post.thumbnailUrl && (
        <Image src={post.thumbnailUrl} alt="" className="post-card__thumbnail" width={800} height={180} />
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
