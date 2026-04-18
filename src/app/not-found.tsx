'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { routes } from '@/routes'
import '@/assets/stylesheets/not-found.scss'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <p className="not-found__message">{t('not_found.message')}</p>
      <Link className="not-found__link" href={routes.Home}>{t('not_found.back_home')}</Link>
    </div>
  )
}
