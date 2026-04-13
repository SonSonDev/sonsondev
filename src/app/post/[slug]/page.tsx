import { notFound } from 'next/navigation'
import { getServerFirebase, getServerFirebasePublic } from '@/firebase/server'
import { fetchPostBySlug, fetchPublishedPosts } from '@/firebase/posts'
import PostContent from '@/views/Post/PostContent'
import { SerializedPost } from '@/types/post'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const { db } = getServerFirebasePublic()
    const posts = await fetchPublishedPosts(db)
    return posts.map(post => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { db, auth } = await getServerFirebase()
  const isAdmin = !!auth.currentUser
  const post = await fetchPostBySlug(slug, !isAdmin, db)
  if (!post) notFound()

  const serializedPost: SerializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
  }

  return <PostContent post={serializedPost} />
}
