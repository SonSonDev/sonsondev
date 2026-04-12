import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signInWithGoogle } from '../../firebase/auth'
import { routes } from '../../routes'
import './Login.scss'

export default function Login() {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGoogle = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      navigate(routes.Admin)
    } catch {
      setError(t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__form">
        <h1>{t('login.title')}</h1>
        {error && <p className="login__error">{error}</p>}
        <button className="login__google" onClick={handleGoogle} disabled={loading}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          {loading ? t('action.signing_in') : t('action.sign_in_with_google')}
        </button>
      </div>
    </div>
  )
}
