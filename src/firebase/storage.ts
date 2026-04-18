import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'
import { storage } from './index'

export interface StorageImage {
  name: string
  fullPath: string
  url: string
}

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `images/${Date.now()}-${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export const listImages = async (): Promise<StorageImage[]> => {
  const { storage: s } = await import('./index')
  const listRef = ref(s, 'images')
  const result = await listAll(listRef)
  return Promise.all(result.items.map(async item => ({
    name: item.name,
    fullPath: item.fullPath,
    url: await getDownloadURL(item),
  })))
}

export const deleteImage = async (fullPath: string): Promise<void> => {
  const { storage: s } = await import('./index')
  await deleteObject(ref(s, fullPath))
}
