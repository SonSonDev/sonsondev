import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchPublishedPosts } from '../../firebase/posts'
import { Post } from '../../types/post'
import PostCard from '../../components/PostCard'
import './Posts.scss'

export default function Posts() {
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
    <div className="posts-page">
      <h1>{t('posts.title')}</h1>
      <div className="posts-page__grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
