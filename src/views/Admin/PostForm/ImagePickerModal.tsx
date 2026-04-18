'use client'

import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { uploadImage, listImages, StorageImage } from '@/firebase/storage'

interface Props {
  open: boolean
  onClose: () => void
  onSelectThumbnail: (url: string) => void
}

export default function ImagePickerModal({ open, onClose, onSelectThumbnail }: Props) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<StorageImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
      setSelected(null)
      setCopied(false)
      setLoading(true)
      listImages().then(imgs => {
        setImages(imgs)
        setLoading(false)
      })
    } else {
      dialogRef.current?.close()
    }
  }, [open])

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onClose()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    await Promise.all(files.map(uploadImage))
    const imgs = await listImages()
    setImages(imgs)
    setUploading(false)
    e.target.value = ''
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      onClose()
    }, 1500)
  }

  if (!mounted) return null

  return ReactDOM.createPortal(
    <dialog ref={dialogRef} className="image-picker-modal" onCancel={handleCancel}>
      <div className="image-picker-modal__inner">
        <div className="image-picker-modal__toolbar">
          <Button
            variant="primary"
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? t('common.loading') : t('admin.upload_new')}
          </Button>
          <Button variant="ghost" type="button" onClick={onClose} aria-label="Fermer">✕</Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="post-form__file-input"
            onChange={handleUpload}
          />
        </div>

        <div className="image-picker-modal__grid">
          {loading ? (
            <p className="image-picker-modal__loading">{t('common.loading')}</p>
          ) : (
            images.map(img => (
              <button
                key={img.fullPath}
                type="button"
                className={`image-picker-modal__card${selected === img.url ? ' image-picker-modal__card--selected' : ''}`}
                onClick={() => setSelected(img.url)}
              >
                <Image src={img.url} alt={img.name} fill style={{ objectFit: 'cover' }} />
              </button>
            ))
          )}
        </div>

        {selected && (
          <div className="image-picker-modal__actions">
            {copied ? (
              <span className="image-picker-modal__copied">{t('admin.copied')}</span>
            ) : (
              <>
                <Button type="button" variant="primary" onClick={() => copyToClipboard(`<img src="${selected}" alt="" width="150" style="float:left;margin-right:30px" />`)}>
                  {t('admin.copy_as_left_image')}
                </Button>
                <Button type="button" variant="primary" onClick={() => copyToClipboard(`<img src="${selected}" alt="" width="150" style="float:right;margin-left:30px" />`)}>
                  {t('admin.copy_as_right_image')}
                </Button>
                <Button type="button" variant="primary" onClick={() => copyToClipboard(`::tooltip[,${selected}]`)}>
                  {t('admin.copy_as_tooltip')}
                </Button>
                <Button type="button" variant="primary" onClick={() => { onSelectThumbnail(selected); onClose() }}>
                  {t('admin.set_thumbnail')}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </dialog>,
    document.body,
  )
}
