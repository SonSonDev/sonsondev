import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addPost } from '../../../firebase/posts'
import { generateSlug } from '../../../utils/string'
import './NewArticle.scss'

export default function NewArticle() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await addPost({ title, slug, excerpt, content, published })
    navigate('/admin/articles')
  }

  return (
    <div className="new-article">
      <h1>{t('admin.newArticle')}</h1>
      <form className="new-article__form" onSubmit={handleSubmit}>
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

        <label className="new-article__checkbox">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          {t('admin.publish')}
        </label>

        <button type="submit" disabled={saving}>
          {saving ? t('action.saving') : t('action.save')}
        </button>
      </form>
    </div>
  )
}
