// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './translations';

// Explicitly normalize all translation strings to NFC to fix Vietnamese diacritics
Object.keys(resources).forEach((lang) => {
  const dict = (resources as any)[lang].translation;
  Object.keys(dict).forEach((k) => {
    if (typeof dict[k] === 'string') {
      dict[k] = dict[k].normalize('NFC');
    }
  });
});

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lottery_lang',
      caches: ['localStorage']
    }
  });

export default i18n;