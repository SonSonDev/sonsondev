import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import I18nProvider from '@/components/providers/I18nProvider'
import PageTracker from '@/components/providers/PageTracker'
import Navbar from '@/components/layout/Navbar'
import '@/assets/stylesheets/app.scss'

export const metadata: Metadata = {
  title: 'SonSonDev',
  description: 'SonSonDev blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <I18nProvider>
          <AuthProvider>
            <PageTracker />
            <Navbar />
            <main className="container">
              {children}
            </main>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
