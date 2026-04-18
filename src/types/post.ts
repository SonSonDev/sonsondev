import { Timestamp } from 'firebase/firestore'

export interface PostBase {
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  thumbnailUrl?: string
  showThumbnail?: boolean
  tagIds?: string[]
}

export interface PostPayload extends PostBase {
  createdAt: Timestamp
}

export interface Post extends PostBase {
  id: string
  createdAt: Date
}

export type SerializedPost = Omit<Post, 'createdAt'> & { createdAt: string }
