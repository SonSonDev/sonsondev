import { t } from '@/locales/t'

export default function Home() {
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <div style={{ marginTop: '16px' }}></div>
      <p>Y a quoi ?</p>
      <p>Y a rien ...</p>
    </div>
  )
}
