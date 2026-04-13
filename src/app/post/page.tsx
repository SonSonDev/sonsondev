import { getServerFirebasePublic } from '@/firebase/server'
import { fetchPublishedPosts } from '@/firebase/posts'
import PostCard from '@/components/ui/PostCard'
import { t } from '@/locales/t'
import '@/assets/stylesheets/posts.scss'

export const revalidate = 60

export default async function PostsPage() {
  const { db } = getServerFirebasePublic()
  const posts = await fetchPublishedPosts(db)

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
