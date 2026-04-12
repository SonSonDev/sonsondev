import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchPublishedPosts } from '../firebase/posts'
import { Post } from '../types/post'
import PostCard from '../components/PostCard'
import './Home.scss'

export default function Home() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublishedPosts().then(data => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>{t('common.loading')}</p>

  return (
    <div className="home">
      <h1>{t('home.title')}</h1>
      <div className="home__grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
