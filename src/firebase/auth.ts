import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from './index'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider)

export const signOutUser = () => signOut(auth)

export const onAuthChanged = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback)
