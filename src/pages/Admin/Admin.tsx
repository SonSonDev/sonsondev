import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Admin.scss'

export default function Admin() {
  const { t } = useTranslation()

  return (
    <div className="admin">
      <nav className="admin__nav">
        <ul className="admin__nav-list">
          <li>
            <NavLink to="/admin/articles">{t('admin.articles')}</NavLink>
          </li>
        </ul>
      </nav>
      <div className="admin__content">
        <Outlet />
      </div>
    </div>
  )
}
