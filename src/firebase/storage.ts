import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './index'

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `images/${Date.now()}-${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
