import { notFound } from 'next/navigation'
import { fetchPostBySlug, fetchPublishedPosts } from '@/firebase/posts'
import PostContent from '@/views/Post/PostContent'
import { SerializedPost } from '@/types/post'

export async function generateStaticParams() {
  const posts = await fetchPublishedPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await fetchPostBySlug(slug, true)
  if (!post) notFound()

  const serializedPost: SerializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
  }

  return <PostContent post={serializedPost} />
}
