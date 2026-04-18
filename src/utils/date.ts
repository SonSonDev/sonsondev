import { Timestamp } from 'firebase/firestore'

export const fromTimestamp = (timestamp: Timestamp): Date => timestamp.toDate()

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const formatDateShort = (date: Date): string =>
  date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
