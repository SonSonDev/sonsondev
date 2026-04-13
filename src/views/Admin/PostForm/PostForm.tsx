'use client'

import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { MediaImage } from 'iconoir-react'
import { PostBase } from '@/types/post'
import { generateSlug } from '@/utils/string'
import { uploadImage } from '@/firebase/storage'
import Button from '@/components/ui/Button'
import '@/assets/stylesheets/post-form.scss'

interface Props {
  heading: string
  initialValues?: PostBase
  onSubmit: (data: PostBase) => Promise<void>
  preview?: boolean
}

export default function PostForm({ heading, initialValues, onSubmit, preview = false }: Props) {
  const { t } = useTranslation()
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [slug, setSlug] = useState(initialValues?.slug ?? '')
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [published, setPublished] = useState(initialValues?.published ?? false)
  const [thumbnailUrl, setThumbnailUrl] = useState(initialValues?.thumbnailUrl ?? '')
  const [showThumbnail, setShowThumbnail] = useState(initialValues?.showThumbnail ?? false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSubmit({ title, slug, excerpt, content, published, thumbnailUrl: thumbnailUrl || undefined, showThumbnail })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)

    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const snippet = `<img src="${url}" alt="" width="800" />`
    setContent(prev => prev.slice(0, start) + snippet + prev.slice(end))

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + snippet.length, start + snippet.length)
    }, 0)

    e.target.value = ''
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingThumbnail(true)
    const url = await uploadImage(file)
    setThumbnailUrl(url)
    setUploadingThumbnail(false)
    e.target.value = ''
  }

  return (
    <div className="post-form">
      <h1>{heading}</h1>
      <form className="post-form__form" onSubmit={handleSubmit}>
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

        <div className="post-form__thumbnail">
          <span>{t('admin.thumbnail')}</span>
          <div className="post-form__thumbnail-upload">
            {thumbnailUrl && (
              <Image src={thumbnailUrl} alt="" className="post-form__thumbnail-preview" width={120} height={80} />
            )}
            <Button
              variant="ghost"
              type="button"
              aria-label={t('admin.thumbnail')}
              disabled={uploadingThumbnail}
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <MediaImage />
            </Button>
          </div>
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="post-form__file-input"
            onChange={handleThumbnailUpload}
          />
          {thumbnailUrl && (
            <label className="post-form__checkbox post-form__thumbnail-toggle">
              <input
                type="checkbox"
                checked={showThumbnail}
                onChange={e => setShowThumbnail(e.target.checked)}
              />
              {t('admin.show_thumbnail')}
            </label>
          )}
        </div>

        <div className="post-form__content-header">
          <span>{t('admin.content')}</span>
          <Button
            variant="ghost"
            type="button"
            aria-label={t('admin.upload_image')}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <MediaImage />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="post-form__file-input"
            onChange={handleImageUpload}
          />
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={15}
          required
        />

        <label className="post-form__checkbox">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          {t('admin.publish')}
        </label>

        <Button type="submit" disabled={saving}>
          {saving ? t('action.saving') : t('action.save')}
        </Button>
      </form>
      {preview && content && (
        <div className="post-form__preview">
          <h2>{t('admin.preview')}</h2>
          <div className="post-form__preview-body">
            {thumbnailUrl && showThumbnail && <Image src={thumbnailUrl} alt="" className="post-form__preview-thumbnail" width={1200} height={300} />}
            {title && <h1>{title}</h1>}
            {excerpt && <p className="post-form__preview-excerpt">{excerpt}</p>}
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
