'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Markdowner from '@/components/ui/Markdowner'
import { PostBase } from '@/types/post'
import { Tag } from '@/types/tag'
import { fetchAllTags } from '@/firebase/tags'
import { generateSlug } from '@/utils/string'
import Button from '@/components/ui/Button'
import ImageUploader from './ImageUploader'
import ImagePickerModal from './ImagePickerModal'
import TagSelector from './TagSelector'
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
  const [tagIds, setTagIds] = useState<string[]>(initialValues?.tagIds ?? [])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [savedValues, setSavedValues] = useState<PostBase | undefined>(initialValues)
  const [pickerOpen, setPickerOpen] = useState(false)

  const isDirty = !savedValues || (
    title !== (savedValues.title ?? '') ||
    slug !== (savedValues.slug ?? '') ||
    excerpt !== (savedValues.excerpt ?? '') ||
    content !== (savedValues.content ?? '') ||
    published !== (savedValues.published ?? false) ||
    thumbnailUrl !== (savedValues.thumbnailUrl ?? '') ||
    showThumbnail !== (savedValues.showThumbnail ?? false) ||
    JSON.stringify(tagIds) !== JSON.stringify(savedValues.tagIds ?? [])
  )

  useEffect(() => { fetchAllTags().then(setAvailableTags) }, [])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const data = { title, slug, excerpt, content, published, thumbnailUrl: thumbnailUrl || undefined, showThumbnail, tagIds }
    await onSubmit(data)
    setSavedValues(data)
    setSaving(false)
  }

  return (
    <div className="post-form">
      <h1>{heading}</h1>
      <form className="post-form__form" onSubmit={handleSubmit}>
        <label>
          {t('admin.title')}
          <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)} required />
        </label>

        <label>
          {t('admin.slug')}
          <input type="text" value={slug} onChange={e => setSlug(e.target.value)} required />
        </label>

        <label>
          {t('admin.excerpt')}
          <input type="text" value={excerpt} onChange={e => setExcerpt(e.target.value)} required />
        </label>

        <div className="post-form__thumbnail">
          <span>{t('admin.thumbnail')}</span>
          <div className="post-form__thumbnail-upload">
            {thumbnailUrl && (
              <Image src={thumbnailUrl} alt="" className="post-form__thumbnail-preview" width={120} height={80} />
            )}
            <ImageUploader aria-label={t('admin.thumbnail')} openPicker={() => setPickerOpen(true)} />
          </div>
          {thumbnailUrl && (
            <label className="post-form__checkbox post-form__thumbnail-toggle">
              <input type="checkbox" checked={showThumbnail} onChange={e => setShowThumbnail(e.target.checked)} />
              {t('admin.show_thumbnail')}
            </label>
          )}
        </div>

        <div className="post-form__content-header">
          <span>{t('admin.content')}</span>
          <ImageUploader aria-label={t('admin.upload_image')} openPicker={() => setPickerOpen(true)} />
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={15} required />

        <TagSelector tags={availableTags} selected={tagIds} onChange={setTagIds} />

        <label className="post-form__checkbox">
          <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
          {t('admin.publish')}
        </label>

        <Button type="submit" disabled={saving || !isDirty}>
          {saving ? t('action.saving') : t('action.save')}
        </Button>
      </form>

      {preview && content && (
        <div className="post-form__preview">
          <h2>{t('admin.preview')}</h2>
          <div className="post-form__preview-body">
            {thumbnailUrl && showThumbnail && (
              <Image src={thumbnailUrl} alt="" className="post-form__preview-thumbnail" width={1200} height={300} />
            )}
            {title && <h1>{title}</h1>}
            {excerpt && <p className="post-form__preview-excerpt">{excerpt}</p>}
            <Markdowner>{content}</Markdowner>
          </div>
        </div>
      )}

      <ImagePickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectThumbnail={url => { setThumbnailUrl(url); setPickerOpen(false) }}
      />
    </div>
  )
}
