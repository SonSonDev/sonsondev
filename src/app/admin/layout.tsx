'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NavArrowDown } from 'iconoir-react'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '@/components/providers/ProtectedRoute'
import { AdminHeaderProvider, useAdminHeader } from '@/context/AdminHeaderContext'
import { routes } from '@/routes'
import '@/assets/stylesheets/admin.scss'

function AdminInner({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { action } = useAdminHeader()

  const sections = [
    { label: t('admin.posts'), href: routes.AdminPost, match: routes.AdminPost },
    { label: t('admin.tags'), href: routes.AdminTag, match: routes.AdminTag },
    { label: t('admin.media'), href: routes.AdminMedia, match: routes.AdminMedia },
  ]

  const current = sections.find(s => pathname.startsWith(s.match))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="admin">
      <div className="admin__header">
        {current && (
          <div className="admin__section-dropdown" ref={ref}>
            <button
              className="admin__section-trigger"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
            >
              <span>{current.label}</span>
              <NavArrowDown className={open ? 'rotated' : ''} />
            </button>
            {open && (
              <ul className="admin__section-list">
                {sections.map(s => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className={pathname.startsWith(s.match) ? 'active' : ''}
                      onClick={() => setOpen(false)}
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {action && <div className="admin__header-action">{action}</div>}
      </div>
      <div className="admin__content">
        {children}
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminHeaderProvider>
        <AdminInner>{children}</AdminInner>
      </AdminHeaderProvider>
    </ProtectedRoute>
  )
}
