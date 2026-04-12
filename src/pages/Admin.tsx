import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchAllPosts, addPost, togglePostPublished, deletePost } from '../firebase/posts'
import { Post } from '../types/post'
import { generateSlug } from '../utils/string'
import './Admin.scss'

export default function Admin() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const loadPosts = () => fetchAllPosts().then(setPosts)

  useEffect(() => { loadPosts() }, [])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await addPost({ title, slug, excerpt, content, published })
    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setPublished(false)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    loadPosts()
  }

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
    <div className="admin">
      {posts.length > 0 && (
        <section className="admin__list">
          <h2>{t('admin.articles')}</h2>
          <ul>
            {posts.map(post => (
              <li key={post.id} className="admin__item">
                <div className="admin__item-info">
                  <span className={`admin__badge ${post.published ? 'admin__badge--published' : ''}`}>
                    {post.published ? t('admin.published') : t('admin.draft')}
                  </span>
                  <span className="admin__item-title">{post.title}</span>
                </div>
                <div className="admin__item-actions">
                  <button onClick={() => handleToggle(post)}>
                    {post.published ? t('admin.unpublish') : t('admin.publish')}
                  </button>
                  <button className="admin__delete" onClick={() => handleDelete(post.id)}>
                    {t('admin.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h1>{t('admin.newArticle')}</h1>
      {success && <p className="admin__success">{t('admin.saved')}</p>}
      <form className="admin__form" onSubmit={handleSubmit}>
        <label>
          {t('admin.title')}
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            required
          />
        </label>

        <label>
          {t('admin.slug')}
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
          />
        </label>

        <label>
          {t('admin.excerpt')}
          <input
            type="text"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            required
          />
        </label>

        <label>
          {t('admin.content')}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={15}
            required
          />
        </label>

        <label className="admin__checkbox">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          {t('admin.publish')}
        </label>

        <button type="submit" disabled={saving}>
          {saving ? t('admin.saving') : t('admin.save')}
        </button>
      </form>
    </div>
  )
}
