import { load } from 'js-yaml'
import frRaw from './fr.yml?raw'

export const fr = load(frRaw) as Record<string, string>
