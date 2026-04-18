'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 500, easing: 'ease', fill: 'forwards' },
    )
  }, [pathname])

  return <div ref={ref}>{children}</div>
}
