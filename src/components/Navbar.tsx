import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useTranslation } from 'react-i18next'
import { auth } from '../firebase/index'
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
          <li><Link to="/">{t('navbar.articles')}</Link></li>
          {user ? (
            <>
              <li><Link to="/admin">{t('navbar.admin')}</Link></li>
              <li>
                <button className="navbar__logout" onClick={() => signOut(auth)}>
                  {t('navbar.logout')}
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  )
}
