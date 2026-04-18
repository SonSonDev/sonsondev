'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { onAuthChanged } from '@/firebase/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChanged(async currentUser => {
      setUser(currentUser)
      setLoading(false)
      if (currentUser) {
        const token = await currentUser.getIdToken()
        document.cookie = `__firebase_token=${token}; path=/; SameSite=Strict; max-age=3600`
      } else {
        document.cookie = `__firebase_token=; path=/; max-age=0`
      }
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
