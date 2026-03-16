// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './translations';  // 引入上面改好的文件

i18n
  .use(initReactI18next)          // 连接 React
  .use(LanguageDetector)          // 自动检测浏览器语言
  .init({
    resources,
    fallbackLng: 'zh',            // 默认语言
    interpolation: {
      escapeValue: false          // React 已处理 XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lottery_lang',  // 保存在 localStorage 的 key
      caches: ['localStorage']
    }
  });

export default i18n;