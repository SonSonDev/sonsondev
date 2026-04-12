import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { PostBase } from '../../../types/post'
import { generateSlug } from '../../../utils/string'
import './ArticleForm.scss'

interface Props {
  heading: string
  initialValues?: PostBase
  onSubmit: (data: PostBase) => Promise<void>
  preview?: boolean
}

export default function ArticleForm({ heading, initialValues, onSubmit, preview = false }: Props) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [published, setPublished] = useState(initialValues?.published ?? false)
  const [saving, setSaving] = useState(false)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSubmit({ title, slug, excerpt, content, published })
  }

  return (
    <div className="article-form">
      <h1>{heading}</h1>
      <form className="article-form__form" onSubmit={handleSubmit}>
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

        <label className="article-form__checkbox">
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
      {preview && content && (
        <div className="article-form__preview">
          <h2>{t('admin.preview')}</h2>
          <div className="article-form__preview-body">
            {title && <h1>{title}</h1>}
            {excerpt && <p className="article-form__preview-excerpt">{excerpt}</p>}
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
