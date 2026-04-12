import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, orderBy, query, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
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

  const fetchPosts = async () => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    setPosts(snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt.toDate(),
    })) as Post[])
  }

  useEffect(() => { fetchPosts() }, [])

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

    await addDoc(collection(db, 'posts'), {
      title,
      slug,
      excerpt,
      content,
      published,
      createdAt: Timestamp.now(),
    })

    setTitle('')
    setSlug('')
    setExcerpt('')
    setContent('')
    setPublished(false)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
    fetchPosts()
  }

  const togglePublished = async (post: Post) => {
    await updateDoc(doc(db, 'posts', post.id), { published: !post.published })
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return
    await deleteDoc(doc(db, 'posts', id))
    fetchPosts()
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
                  <button onClick={() => togglePublished(post)}>
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
