'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { signInWithGoogle } from '@/firebase/auth'
import { routes } from '@/routes'
import '@/assets/stylesheets/login.scss'

export default function LoginPage() {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogle = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      router.push(routes.Admin)
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
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width={20}
            height={20}
            unoptimized
          />
          {loading ? t('action.signing_in') : t('action.sign_in_with_google')}
        </button>
      </div>
    </div>
  )
}
