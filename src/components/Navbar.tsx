import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './Navbar.scss'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">Mon Blog</Link>
        <ul className="navbar__links">
          <li><Link to="/">Articles</Link></li>
          {user ? (
            <>
              <li><Link to="/admin">Admin</Link></li>
              <li>
                <button className="navbar__logout" onClick={() => signOut(auth)}>
                  Déconnexion
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  )
}
