import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { db } from './index'
import { Post } from '../types/post'

const postsCollection = collection(db, 'posts')

export const fetchPublishedPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, where('published', '==', true), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt.toDate(),
  })) as Post[]
}

export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  const q = query(postsCollection, where('slug', '==', slug), where('published', '==', true))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const d = snapshot.docs[0]
  return { id: d.id, ...d.data(), createdAt: d.data().createdAt.toDate() } as Post
}

export const fetchAllPosts = async (): Promise<Post[]> => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt.toDate(),
  })) as Post[]
}

export const addPost = async (data: Omit<Post, 'id' | 'createdAt'>) => {
  await addDoc(postsCollection, { ...data, createdAt: Timestamp.now() })
}

export const togglePostPublished = async (post: Post) => {
  await updateDoc(doc(db, 'posts', post.id), { published: !post.published })
}

export const deletePost = async (id: string) => {
  await deleteDoc(doc(db, 'posts', id))
}
