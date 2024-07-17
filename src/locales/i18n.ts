import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import translationEnglish from './lang/en_US.json'
import translationPolish from './lang/pl_PL.json'

const resources = {
  en: {
    main: translationEnglish,
  },
  pl: {
    main: translationPolish,
  },
}

const DETECTION_OPTIONS = {
  order: ['cookie', 'localStorage', 'navigator'],
  caches: ['cookie', 'localStorage'],
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
}

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: DETECTION_OPTIONS,
    resources,
    debug: false,
    fallbackLng: 'en',
    react: {
      bindI18n: 'loaded languageChanged',
      bindI18nStore: 'added',
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {})

export const setLanguage = (lang: string) => {
  i18next.changeLanguage(lang).then(() => {})
}

export default i18next
