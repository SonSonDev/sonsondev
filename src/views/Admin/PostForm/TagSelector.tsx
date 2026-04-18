'use client'

import { useTranslation } from 'react-i18next'
import { Tag } from '@/types/tag'

interface Props {
  tags: Tag[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function TagSelector({ tags, selected, onChange }: Props) {
  const { t } = useTranslation()

  if (!tags.length) return null

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])

  return (
    <div className="post-form__tags">
      <span className="post-form__tags-label">{t('admin.tags_label')}</span>
      <div className="post-form__tags-list">
        {tags.map(tag => {
          const isSelected = selected.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              className={`post-form__tag${isSelected ? ' post-form__tag--selected' : ''}`}
              onClick={() => toggle(tag.id)}
            >
              {tag.color && (
                <span
                  className="post-form__tag-dot"
                  style={{ background: isSelected ? tag.color : 'transparent', borderColor: tag.color }}
                />
              )}
              {tag.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
