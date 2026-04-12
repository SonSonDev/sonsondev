import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import './Login.scss'

const provider = new GoogleAuthProvider()

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGoogle = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithPopup(auth, provider)
      navigate('/admin')
    } catch {
      setError('Erreur lors de la connexion Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login__form">
        <h1>Connexion</h1>
        {error && <p className="login__error">{error}</p>}
        <button className="login__google" onClick={handleGoogle} disabled={loading}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          {loading ? 'Connexion...' : 'Continuer avec Google'}
        </button>
      </div>
    </div>
  )
}
