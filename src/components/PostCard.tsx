import { Link } from 'react-router-dom'
import { Post } from '../types/post'
import './PostCard.scss'

interface Props {
  post: Post
}

export default function PostCard({ post }: Props) {
  const formattedDate = post.createdAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="post-card">
      <span className="post-card__date">{formattedDate}</span>
      <h2 className="post-card__title">
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="post-card__excerpt">{post.excerpt}</p>
      <Link to={`/post/${post.slug}`} className="post-card__link">
        Lire la suite →
      </Link>
    </article>
  )
}
