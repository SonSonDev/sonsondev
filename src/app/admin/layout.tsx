'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import ProtectedRoute from '@/components/providers/ProtectedRoute'
import { routes } from '@/routes'
import '@/assets/stylesheets/admin.scss'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const pathname = usePathname()

  return (
    <ProtectedRoute>
      <div className="admin">
        <nav className="admin__nav">
          <ul className="admin__nav-list">
            <li>
              <Link
                href={routes.AdminPost}
                className={pathname.startsWith(routes.AdminPost) ? 'active' : ''}
              >
                {t('admin.posts')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="admin__content">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
