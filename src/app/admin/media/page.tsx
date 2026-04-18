'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { Trash } from 'iconoir-react'
import { listImages, deleteImage, StorageImage } from '@/firebase/storage'
import { fetchAllPosts } from '@/firebase/posts'
import { Post } from '@/types/post'
import Button from '@/components/ui/Button'
import Loader from '@/components/ui/Loader'
import { routes } from '@/routes'
import '@/assets/stylesheets/admin-media.scss'

type ImageUsage = { post: Post; as: 'thumbnail' | 'content' }

type EnrichedImage = StorageImage & { usages: ImageUsage[] }

export default function AdminMediaPage() {
  const { t } = useTranslation()
  const [images, setImages] = useState<EnrichedImage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [imgs, posts] = await Promise.all([listImages(), fetchAllPosts()])
    const enriched = imgs.map(img => {
      const usages: ImageUsage[] = []
      for (const post of posts) {
        if (post.thumbnailUrl === img.url) usages.push({ post, as: 'thumbnail' })
        if (post.content.includes(img.url)) usages.push({ post, as: 'content' })
      }
      return { ...img, usages }
    })
    setImages(enriched)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (img: EnrichedImage) => {
    if (!confirm(t('admin.delete_confirm_image'))) return
    await deleteImage(img.fullPath)
    load()
  }

  if (loading) return <Loader />

  if (!images.length) return <p className="admin-media__empty">{t('admin.no_images')}</p>

  return (
    <div className="admin-media__grid">
      {images.map(img => (
        <div key={img.fullPath} className="admin-media__card">
          <div className="admin-media__image-wrap">
            <Image src={img.url} alt={img.name} fill className="admin-media__image" />
          </div>
          <div className="admin-media__info">
            <span className="admin-media__name" title={img.name}>{img.name}</span>
            <div className="admin-media__usages">
              {img.usages.length === 0 ? (
                <span className="admin-media__badge admin-media__badge--unused">{t('admin.unused')}</span>
              ) : (
                img.usages.map((u, i) => (
                  <Link key={i} href={routes.AdminEditPost(u.post.id)} className="admin-media__badge admin-media__badge--used">
                    {u.as === 'thumbnail' ? t('admin.used_as_thumbnail') : t('admin.used_in_content')} : {u.post.title}
                  </Link>
                ))
              )}
            </div>
            <div className="admin-media__actions">
              <Button variant="danger" onClick={() => handleDelete(img)} aria-label={t('action.delete')}>
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
