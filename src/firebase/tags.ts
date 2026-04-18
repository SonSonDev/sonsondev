import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { Tag } from '@/types/tag'
import { Collections } from './collections'
import { getClientDb } from './base'
import { stripUndefined } from './utils'

const toTag = (d: QueryDocumentSnapshot): Tag => {
  const data = d.data() as { name: string; color?: string }
  return { id: d.id, name: data.name, color: data.color }
}

export const fetchAllTags = async (): Promise<Tag[]> => {
  const db = await getClientDb()
  const q = query(collection(db, Collections.tags), orderBy('name'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(toTag)
}

export const addTag = async (name: string, color?: string): Promise<Tag> => {
  const db = await getClientDb()
  const ref = await addDoc(collection(db, Collections.tags), stripUndefined({ name, color }))
  return { id: ref.id, name, color }
}

export const updateTag = async (id: string, name: string, color?: string): Promise<void> => {
  const db = await getClientDb()
  await updateDoc(doc(db, Collections.tags, id), stripUndefined({ name, color }))
}

export const deleteTag = async (id: string): Promise<void> => {
  const db = await getClientDb()
  await deleteDoc(doc(db, Collections.tags, id))
}
