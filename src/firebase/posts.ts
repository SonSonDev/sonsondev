import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { Post, PostBase, PostPayload } from '@/types/post'
import { Collections } from './collections'
import { getClientDb } from './base'
import { stripUndefined } from './utils'
import { fromTimestamp } from '@/utils/date'
import { Firestore } from 'firebase/firestore'

const toPost = (d: QueryDocumentSnapshot): Post => {
  const data = d.data() as PostPayload
  return { id: d.id, ...data, createdAt: fromTimestamp(data.createdAt) }
}

// ── Public reads (server + client) ──────────────────────────────────────────

export const fetchPublishedPosts = async (db?: Firestore): Promise<Post[]> => {
  const firestore = db ?? await getClientDb()
  const q = query(
    collection(firestore, Collections.posts),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(toPost)
}

export const fetchPostBySlug = async (
  slug: string,
  publishedOnly = true,
  db?: Firestore,
): Promise<Post | null> => {
  const firestore = db ?? await getClientDb()
  const constraints = publishedOnly
    ? [where('slug', '==', slug), where('published', '==', true)]
    : [where('slug', '==', slug)]
  const q = query(collection(firestore, Collections.posts), ...constraints)
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return toPost(snapshot.docs[0])
}

// ── Admin writes (client only) ───────────────────────────────────────────────

export const fetchAllPosts = async (): Promise<Post[]> => {
  const db = await getClientDb()
  const q = query(collection(db, Collections.posts), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(toPost)
}

export const fetchPostById = async (id: string): Promise<Post | null> => {
  const db = await getClientDb()
  const snapshot = await getDoc(doc(db, Collections.posts, id))
  if (!snapshot.exists()) return null
  return toPost(snapshot as QueryDocumentSnapshot)
}

export const addPost = async (data: PostBase): Promise<string> => {
  const db = await getClientDb()
  const ref = await addDoc(collection(db, Collections.posts), {
    ...stripUndefined(data),
    createdAt: Timestamp.now(),
  })
  return ref.id
}

export const updatePost = async (id: string, data: PostBase) => {
  const db = await getClientDb()
  await updateDoc(doc(db, Collections.posts, id), { ...stripUndefined(data) })
}

export const togglePostPublished = async (post: Post) => {
  const db = await getClientDb()
  await updateDoc(doc(db, Collections.posts, post.id), { published: !post.published })
}

export const deletePost = async (id: string) => {
  const db = await getClientDb()
  await deleteDoc(doc(db, Collections.posts, id))
}
