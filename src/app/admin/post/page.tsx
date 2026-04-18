'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EditPencil, Trash, Eye, EyeClosed, Page } from 'iconoir-react'
import { fetchAllPosts, togglePostPublished, deletePost } from '@/firebase/posts'
import { Post } from '@/types/post'
import Button from '@/components/ui/Button'
import SuperTable, { Column } from '@/components/ui/SuperTable'
import { useAdminHeader } from '@/context/AdminHeaderContext'
import { useCollection } from '@/hooks/useCollection'
import { routes } from '@/routes'
import { formatDateShort } from '@/utils/date'
import '@/assets/stylesheets/admin-posts.scss'
import '@/assets/stylesheets/admin-shared.scss'

export default function AdminPostsPage() {
  const { t } = useTranslation()
  const { items: posts, loading, reload } = useCollection(fetchAllPosts)
  const { setAction } = useAdminHeader()

  useEffect(() => {
    setAction(<Button as="link" to={routes.AdminNewPost}>New</Button>)
    return () => setAction(null)
  }, [])

  const handleToggle = async (post: Post) => {
    await togglePostPublished(post)
    reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.delete_confirm'))) return
    await deletePost(id)
    reload()
  }

  const columns: Column<Post>[] = [
    {
      id: 'title',
      label: t('admin.title'),
      ellipsis: true,
      render: post => (
        <>
          <span className="posts__title">{post.title}</span>
          <span className="posts__meta">
            <span className="posts__date">{formatDateShort(post.createdAt)}</span>
            {!post.published && <span className="posts__badge">N</span>}
          </span>
        </>
      ),
    },
    {
      id: 'actions',
      fitContent: true,
      align: 'right',
      render: post => (
        <span className="admin-list__actions">
          <Button as="link" variant="ghost" to={routes.AdminViewPost(post.id)} aria-label={t('action.view')}>
            <Page />
          </Button>
          <Button as="link" variant="ghost" to={routes.AdminEditPost(post.id)} aria-label={t('action.edit')}>
            <EditPencil />
          </Button>
          <Button variant="ghost" onClick={() => handleToggle(post)} aria-label={post.published ? t('action.unpublish') : t('action.publish')}>
            {post.published ? <EyeClosed /> : <Eye />}
          </Button>
          <Button variant="danger" onClick={() => handleDelete(post.id)} aria-label={t('action.delete')}>
            <Trash />
          </Button>
        </span>
      ),
    },
  ]

  return (
    <div className="posts">
      <SuperTable
        columns={columns}
        data={posts}
        loading={loading}
        placeholder={t('admin.no_posts')}
      />
    </div>
  )
}
