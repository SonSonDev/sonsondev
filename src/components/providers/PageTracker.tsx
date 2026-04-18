'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logEvent } from 'firebase/analytics'
import { analytics } from '@/firebase/index'

export default function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!analytics) return
    const track = async () => {
      const a = await analytics
      if (a) logEvent(a, 'page_view', { page_path: pathname })
    }
    track()
  }, [pathname])

  return null
}
