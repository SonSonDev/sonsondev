import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { EditPencil, Trash, Eye, EyeClosed } from 'iconoir-react'
import { fetchAllPosts, togglePostPublished, deletePost } from '../../../firebase/posts'
import { Post } from '../../../types/post'
import Button from '../../../components/Button/Button'
import { routes } from '../../../routes'
import './Posts.scss'

export default function Posts() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])

  const loadPosts = () => fetchAllPosts().then(setPosts)

  useEffect(() => { loadPosts() }, [])

  const handleToggle = async (post: Post) => {
    await togglePostPublished(post)
    loadPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.delete_confirm'))) return
    await deletePost(id)
    loadPosts()
  }

  return (
    <div className="posts">
      <div className="posts__header">
        <h2>{t('admin.posts')}</h2>
        <Button as="link" to={routes.AdminNewPost}>{t('admin.new_post')}</Button>
      </div>
      <table className="posts__table">
        <thead>
          <tr>
            <th>{t('admin.title')}</th>
            <th>{t('admin.status')}</th>
            <th>{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td><Link to={routes.Post(post.slug)}>{post.title}</Link></td>
              <td>
                <span className={`posts__badge ${post.published ? 'posts__badge--published' : ''}`}>
                  {post.published ? t('admin.published') : t('admin.draft')}
                </span>
              </td>
              <td className="posts__actions">
                <Button as="link" variant="ghost" to={routes.AdminEditPost(post.id)} aria-label={t('action.edit')}>
                  <EditPencil />
                </Button>
                <Button variant="ghost" onClick={() => handleToggle(post)} aria-label={post.published ? t('action.unpublish') : t('action.publish')}>
                  {post.published ? <EyeClosed /> : <Eye />}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(post.id)} aria-label={t('action.delete')}>
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
