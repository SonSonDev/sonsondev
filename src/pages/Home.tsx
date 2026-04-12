import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { Post } from '../types/post'
import PostCard from '../components/PostCard'
import './Home.scss'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Post[]
      setPosts(data)
      setLoading(false)
    }

    fetchPosts()
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
