'use client'

import { useRef, useState } from 'react'
import { MediaImage } from 'iconoir-react'
import Button from '@/components/ui/Button'
import { uploadImage } from '@/firebase/storage'

interface Props {
  onUpload?: (url: string) => void
  openPicker?: () => void
  'aria-label'?: string
}

export default function ImageUploader({ onUpload, openPicker, 'aria-label': ariaLabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)
    onUpload?.(url)
    e.target.value = ''
  }

  return (
    <>
      <Button
        variant="ghost"
        type="button"
        aria-label={ariaLabel}
        disabled={uploading}
        onClick={() => openPicker ? openPicker() : inputRef.current?.click()}
      >
        <MediaImage />
      </Button>
      {!openPicker && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="post-form__file-input"
          onChange={handleChange}
        />
      )}
    </>
  )
}
