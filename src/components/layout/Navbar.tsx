'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Xmark } from 'iconoir-react'
import { useTranslation } from 'react-i18next'
import { signOutUser } from '@/firebase/auth'
import { useAuth } from '@/context/AuthContext'
import { routes } from '@/routes'
import '@/assets/stylesheets/navbar.scss'

export default function Navbar() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const close = () => setOpen(false)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className={`navbar${open ? ' navbar--open' : ''}`}>
      <div className="navbar__inner">
        <Link href={routes.Home} className="navbar__logo" onClick={close}>{t('navbar.logo')}</Link>
        <button className="navbar__toggle" onClick={() => setOpen(o => !o)} aria-label={open ? t('action.close_nav') : t('action.open_nav')}>
          {open ? <Xmark /> : <Menu />}
        </button>
        <ul className="navbar__links">
          <li><Link href={routes.Home} className={isActive(routes.Home) ? 'active' : ''} onClick={close}>{t('navbar.home')}</Link></li>
          <li><Link href={routes.PostList} className={isActive(routes.PostList) ? 'active' : ''} onClick={close}>{t('navbar.posts')}</Link></li>
          <li><Link href={routes.TodoList} className={isActive(routes.TodoList) ? 'active' : ''} onClick={close}>{t('navbar.todo')}</Link></li>
          {user ? (
            <>
              <li><Link href={routes.Admin} className={isActive(routes.Admin) ? 'active' : ''} onClick={close}>{t('navbar.admin')}</Link></li>
              <li>
                <button className="navbar__logout" onClick={() => { signOutUser(); close() }}>
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
