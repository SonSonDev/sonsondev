'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash, Check } from 'iconoir-react'
import { fetchAllTags, addTag, updateTag, deleteTag } from '@/firebase/tags'
import { Tag } from '@/types/tag'
import Button from '@/components/ui/Button'
import SuperTable, { Column } from '@/components/ui/SuperTable'
import { useCollection } from '@/hooks/useCollection'
import '@/assets/stylesheets/admin-shared.scss'

const DEFAULT_COLOR = '#6b7280'

type Draft = { name: string; color: string }

export default function AdminTagsPage() {
  const { t } = useTranslation()
  const { items: tags, loading, reload } = useCollection(fetchAllTags)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(DEFAULT_COLOR)

  useEffect(() => {
    const initial: Record<string, Draft> = {}
    tags.forEach(tag => { initial[tag.id] = { name: tag.name, color: tag.color ?? DEFAULT_COLOR } })
    setDrafts(initial)
  }, [tags])

  const isDirty = (tag: Tag) => {
    const d = drafts[tag.id]
    if (!d) return false
    return d.name !== tag.name || d.color !== (tag.color ?? DEFAULT_COLOR)
  }

  const handleChange = (id: string, field: keyof Draft, value: string) =>
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))

  const handleSave = async (tag: Tag) => {
    const d = drafts[tag.id]
    if (!d?.name.trim()) return
    await updateTag(tag.id, d.name.trim(), d.color)
    reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.delete_confirm_tag'))) return
    await deleteTag(id)
    reload()
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    await addTag(newName.trim(), newColor)
    setNewName('')
    setNewColor(DEFAULT_COLOR)
    reload()
  }

  const columns: Column<Tag>[] = [
    {
      id: 'color',
      fitContent: true,
      render: tag => (
        <input
          type="color"
          value={drafts[tag.id]?.color ?? DEFAULT_COLOR}
          onChange={e => handleChange(tag.id, 'color', e.target.value)}
          className="admin-list__color-input"
        />
      ),
    },
    {
      id: 'name',
      label: t('admin.tags_label'),
      render: tag => (
        <input
          type="text"
          value={drafts[tag.id]?.name ?? tag.name}
          onChange={e => handleChange(tag.id, 'name', e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(tag) }}
        />
      ),
    },
    {
      id: 'actions',
      fitContent: true,
      align: 'right',
      render: tag => (
        <span className="admin-list__actions">
          {isDirty(tag) && (
            <Button variant="ghost" onClick={() => handleSave(tag)} aria-label={t('action.save')}>
              <Check />
            </Button>
          )}
          <Button variant="danger" onClick={() => handleDelete(tag.id)} aria-label={t('action.delete')}>
            <Trash />
          </Button>
        </span>
      ),
    },
  ]

  return (
    <div>
      <form className="admin-list__add-form" onSubmit={handleAdd}>
        <input
          type="color"
          value={newColor}
          onChange={e => setNewColor(e.target.value)}
          className="admin-list__color-input"
        />
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder={t('admin.tags_label')}
        />
        <Button type="submit">{t('action.add')}</Button>
      </form>
      <SuperTable
        columns={columns}
        data={tags}
        loading={loading}
        placeholder={t('admin.no_tags')}
      />
    </div>
  )
}
