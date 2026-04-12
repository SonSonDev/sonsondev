import { Timestamp } from 'firebase/firestore'

export interface PostBase {
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
}

export interface PostPayload extends PostBase {
  createdAt: Timestamp
}

export interface Post extends PostBase {
  id: string
  createdAt: Date
}
