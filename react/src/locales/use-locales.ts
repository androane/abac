import { defaultLang } from './config-lang'

export function useLocales() {
  return {
    currentLang: defaultLang,
  }
}
