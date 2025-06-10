import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locals/en.json';
import ar from './locals/ar.json';

i18n
  .use(LanguageDetector) // يكتشف لغة المتصفح أو المستخدم
  .use(initReactI18next) // يربط مع React
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en', // اللغة الافتراضية لو الترجمة مش متوفرة
    interpolation: { escapeValue: false },
  });

export default i18n;
