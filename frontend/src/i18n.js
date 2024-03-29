import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import russian from './translations/russian.json'
import english from './translations/english.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
        ru: {
            translation: russian,
        },
        en: {
            translation: english,
        },
    },
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n
