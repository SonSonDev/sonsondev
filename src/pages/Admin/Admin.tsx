import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { routes } from '../../routes'
import './Admin.scss'

export default function Admin() {
  const { t } = useTranslation()

  return (
    <div className="admin">
      <nav className="admin__nav">
        <ul className="admin__nav-list">
          <li>
            <NavLink to={routes.AdminPosts}>{t('admin.posts')}</NavLink>
          </li>
        </ul>
      </nav>
      <div className="admin__content">
        <Outlet />
      </div>
    </div>
  )
}
