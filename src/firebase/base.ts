import { Firestore } from 'firebase/firestore'

export async function getClientDb(): Promise<Firestore> {
  const { db } = await import('./index')
  return db
}
