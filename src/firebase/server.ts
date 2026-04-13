import { initializeServerApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { headers, cookies } from 'next/headers'
import { firebaseConfig } from './config'

/**
 * Initialisation Firebase pour les server components avec contexte utilisateur.
 * Lit le token Firebase depuis le cookie __firebase_token.
 * Appelle headers() et cookies() → force le rendu dynamique (par requête, pas de cache).
 * À utiliser uniquement quand le token auth est nécessaire.
 */
export async function getServerFirebase() {
  const headersObj = await headers()
  const cookieStore = await cookies()
  const authIdToken = cookieStore.get('__firebase_token')?.value ?? undefined

  const serverApp = initializeServerApp(firebaseConfig, {
    authIdToken,
    releaseOnDeref: headersObj,
  })

  const auth = getAuth(serverApp)
  await auth.authStateReady()

  return {
    app: serverApp,
    db: getFirestore(serverApp),
    auth,
  }
}

/**
 * Initialisation Firebase pour les server components publics (sans auth).
 * N'appelle pas headers() → compatible avec le cache Next.js (revalidate).
 */
export function getServerFirebasePublic() {
  const serverApp = initializeServerApp(firebaseConfig, {})
  return {
    app: serverApp,
    db: getFirestore(serverApp),
  }
}
