import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchAllPosts, togglePostPublished, deletePost } from '../../../firebase/posts'
import { Post } from '../../../types/post'
import './Articles.scss'

export default function Articles() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])

  const loadPosts = () => fetchAllPosts().then(setPosts)

  useEffect(() => { loadPosts() }, [])

  const handleToggle = async (post: Post) => {
    await togglePostPublished(post)
    loadPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return
    await deletePost(id)
    loadPosts()
  }

  return (
    <div className="articles">
      <div className="articles__header">
        <h2>{t('admin.articles')}</h2>
        <Link to="/admin/articles/new">{t('admin.newArticle')}</Link>
      </div>
      <table className="articles__table">
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
              <td><Link to={`/post/${post.slug}`}>{post.title}</Link></td>
              <td>
                <span className={`articles__badge ${post.published ? 'articles__badge--published' : ''}`}>
                  {post.published ? t('admin.published') : t('admin.draft')}
                </span>
              </td>
              <td className="articles__actions">
                <button onClick={() => handleToggle(post)}>
                  {post.published ? t('action.unpublish') : t('action.publish')}
                </button>
                <button className="articles__delete" onClick={() => handleDelete(post.id)}>
                  {t('action.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
