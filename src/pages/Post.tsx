import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { fetchPostBySlug } from '../firebase/posts'
import { Post as PostType } from '../types/post'
import './Post.scss'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPostBySlug(slug!).then(data => {
      if (!data) { navigate('/'); return }
      setPost(data)
      setLoading(false)
    })
  }, [slug, navigate])

  if (loading) return <p>Chargement...</p>
  if (!post) return null

  const formattedDate = post.createdAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="post">
      <header className="post__header">
        <span className="post__date">{formattedDate}</span>
        <h1 className="post__title">{post.title}</h1>
      </header>
      <div className="post__content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  )
}
