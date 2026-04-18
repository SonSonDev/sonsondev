import type { Metadata } from 'next'
import { Lato, Roboto_Mono } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import I18nProvider from '@/components/providers/I18nProvider'
import PageTracker from '@/components/providers/PageTracker'
import PageTransition from '@/components/providers/PageTransition'
import Navbar from '@/components/layout/Navbar'
import '@/assets/stylesheets/app.scss'

const fontSans = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fontMono = Roboto_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SonSonDev',
  description: 'SonSonDev blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body>
        <I18nProvider>
          <AuthProvider>
            <PageTracker />
            <Navbar />
            <main className="container">
              <PageTransition>{children}</PageTransition>
            </main>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
