import { fr } from './fr'

type TranslationValue = string | Record<string, string>
type Translations = Record<string, TranslationValue>

export function t(key: string): string {
  const parts = key.split('.')
  let result: Translations | string = fr as unknown as Translations
  for (const part of parts) {
    if (typeof result === 'string') return key
    result = (result as Translations)[part] as Translations | string
    if (result === undefined) return key
  }
  return typeof result === 'string' ? result : key
}
