import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signOutUser } from '../firebase/auth'
import { useAuth } from '../context/AuthContext'
import './Navbar.scss'

export default function Navbar() {
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">{t('navbar.logo')}</Link>
        <ul className="navbar__links">
          <li><Link to="/">{t('navbar.home')}</Link></li>
          {user ? (
            <>
              <li><Link to="/admin">{t('navbar.admin')}</Link></li>
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
