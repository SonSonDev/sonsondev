'use client'

import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
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
            <Button as="link" variant="ghost" className="post__edit" to={routes.AdminEditPost(post.id)} aria-label={t('action.edit')}>
              <EditPencil />
            </Button>
          </>
        )}
      </header>
      <div className="post__content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
