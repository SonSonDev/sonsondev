import { collection, getDocs, getDoc, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from './index'
import { Post, PostBase, PostPayload } from '../types/post'
import { Collections } from './collections'
import { fromTimestamp } from '../utils/date'

const postsCollection = collection(db, Collections.posts)

const toPost = (d: QueryDocumentSnapshot): Post => {
  const data = d.data() as PostPayload
  return { id: d.id, ...data, createdAt: fromTimestamp(data.createdAt) }
}

export const fetchPublishedPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, where('published', '==', true), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(toPost)
}

export const fetchPostBySlug = async (slug: string, publishedOnly = true): Promise<Post | null> => {
  const constraints = publishedOnly
    ? [where('slug', '==', slug), where('published', '==', true)]
    : [where('slug', '==', slug)]
  const q = query(postsCollection, ...constraints)
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return toPost(snapshot.docs[0])
}

export const fetchAllPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(toPost)
}

export const fetchPostById = async (id: string): Promise<Post | null> => {
  const snapshot = await getDoc(doc(db, Collections.posts, id))
  if (!snapshot.exists()) return null
  return toPost(snapshot as QueryDocumentSnapshot)
}

export const updatePost = async (id: string, data: PostBase) => {
  await updateDoc(doc(db, Collections.posts, id), { ...data })
}

export const addPost = async (data: PostBase) => {
  await addDoc(postsCollection, { ...data, createdAt: Timestamp.now() })
}

export const togglePostPublished = async (post: Post) => {
  await updateDoc(doc(db, Collections.posts, post.id), { published: !post.published })
}

export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, Collections.posts, id))
}
