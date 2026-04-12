import { useEffect, useState } from 'react'
import { fetchAllPosts, addPost, togglePostPublished, deletePost } from '../firebase/posts'
import { Post } from '../types/post'
import './Admin.scss'

export default function Admin() {
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

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

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
    if (!confirm('Supprimer cet article ?')) return
    await deletePost(id)
    loadPosts()
  }

  return (
    <div className="admin">
      {posts.length > 0 && (
        <section className="admin__list">
          <h2>Articles</h2>
          <ul>
            {posts.map(post => (
              <li key={post.id} className="admin__item">
                <div className="admin__item-info">
                  <span className={`admin__badge ${post.published ? 'admin__badge--published' : ''}`}>
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                  <span className="admin__item-title">{post.title}</span>
                </div>
                <div className="admin__item-actions">
                  <button onClick={() => handleToggle(post)}>
                    {post.published ? 'Dépublier' : 'Publier'}
                  </button>
                  <button className="admin__delete" onClick={() => handleDelete(post.id)}>
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <h1>Nouvel article</h1>
      {success && <p className="admin__success">Article enregistré !</p>}
      <form className="admin__form" onSubmit={handleSubmit}>
        <label>
          Titre
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            required
          />
        </label>

        <label>
          Slug
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            required
          />
        </label>

        <label>
          Extrait
          <input
            type="text"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            required
          />
        </label>

        <label>
          Contenu (Markdown)
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
          Publier
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
