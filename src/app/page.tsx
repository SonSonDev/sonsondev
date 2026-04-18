'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { routes } from '@/routes'
import '@/assets/stylesheets/home.scss'

export default function Home() {
  const { t } = useTranslation()
  return (
    <div>
<nav className="home-nav">
        <ul>
          <li>
            <Link href={routes.PostList} className="home-nav__link">
              <span className="home-nav__label">{t('home.blog')}</span>
            </Link>
          </li>
          <li>
            <Link href={routes.TodoList} className="home-nav__link">
              <span className="home-nav__label">{t('home.todo')}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
