'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { signOutUser } from '../../firebase/auth'
import { useAuth } from '../../context/AuthContext'
import { routes } from '../../routes'
import '@/assets/stylesheets/navbar.scss'

export default function Navbar() {
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link href={routes.Home} className="navbar__logo">{t('navbar.logo')}</Link>
        <ul className="navbar__links">
          <li><Link href={routes.Home}>{t('navbar.home')}</Link></li>
          <li><Link href={routes.PostList}>{t('navbar.posts')}</Link></li>
          {user ? (
            <>
              <li><Link href={routes.Admin}>{t('navbar.admin')}</Link></li>
              <li>
                <button className="navbar__logout" onClick={() => signOutUser()}>
                  {t('action.logout')}
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  )
}
