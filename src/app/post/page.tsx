import Link from 'next/link'
import { getServerFirebasePublic } from '@/firebase/server'
import { fetchPublishedPosts } from '@/firebase/posts'
import { routes } from '@/routes'
import { formatDateShort } from '@/utils/date'
import '@/assets/stylesheets/posts.scss'

export const revalidate = false

export default async function PostsPage() {
  const { db } = getServerFirebasePublic()
  const posts = await fetchPublishedPosts(db)

  return (
    <div className="posts-page">
      <ul className="post-list">
        {posts.map(post => (
          <li key={post.id}>
            <Link href={routes.Post(post.slug)} className="post-list__item">
              <span className="post-list__date">{formatDateShort(post.createdAt)}</span>
              <span className="post-list__title">{post.title}</span>
              <span className="post-list__excerpt">{post.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
