'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type AdminHeaderContextType = {
  action: ReactNode
  setAction: (node: ReactNode) => void
}

const AdminHeaderContext = createContext<AdminHeaderContextType>({
  action: null,
  setAction: () => {},
})

export function AdminHeaderProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<ReactNode>(null)
  return (
    <AdminHeaderContext.Provider value={{ action, setAction }}>
      {children}
    </AdminHeaderContext.Provider>
  )
}

export function useAdminHeader() {
  return useContext(AdminHeaderContext)
}
