import { useEffect, useState } from 'react'
import { fetchPublishedPosts } from '../firebase/posts'
import { Post } from '../types/post'
import PostCard from '../components/PostCard'
import './Home.scss'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedPosts().then(data => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Chargement...</p>

  return (
    <div className="home">
      <h1>Blog</h1>
      <div className="home__grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
