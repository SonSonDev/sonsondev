'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/routes'

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => { router.replace(routes.AdminPost) }, [router])
  return null
}
