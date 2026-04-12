import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  if (loading) return <p>{t('common.loading')}</p>
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
