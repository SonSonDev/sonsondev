import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <div style={{marginTop: "16px"}}></div>
      <p>Y a quoi ?</p>
      <p>Y a rien ...</p>
    </div>
  )
}
