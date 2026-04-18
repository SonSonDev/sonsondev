'use client'

import Image from 'next/image'
import Markdowner from '@/components/ui/Markdowner'
import { EditPencil } from 'iconoir-react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { routes } from '@/routes'
import { SerializedPost } from '@/types/post'
import { formatDate } from '@/utils/date'
import '@/assets/stylesheets/post.scss'

interface Props {
  post: SerializedPost
}

export default function PostContent({ post }: Props) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const formattedDate = formatDate(new Date(post.createdAt))

  return (
    <article className="post">
      {post.thumbnailUrl && post.showThumbnail && (
        <Image src={post.thumbnailUrl} alt="" className="post__thumbnail" width={1200} height={400} />
      )}
      <header className="post__header">
        <div className="post__meta">
          <span className="post__date">{formattedDate}</span>
          {user && (
            <>
              <span className="post__badge">
                {post.published ? t('admin.published') : t('admin.draft')}
              </span>
              <Button as="link" variant="ghost" className="post__edit" to={routes.AdminEditPost(post.id)} aria-label={t('action.edit')}>
                <EditPencil />
              </Button>
            </>
          )}
        </div>
        <h1 className="post__title">{post.title}</h1>
      </header>
      <div className="post__content">
        <Markdowner>{post.content}</Markdowner>
      </div>
    </article>
  )
}
