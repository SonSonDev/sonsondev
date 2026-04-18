'use client'

import { ReactNode } from 'react'
import '../../locales/i18n'

export default function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
