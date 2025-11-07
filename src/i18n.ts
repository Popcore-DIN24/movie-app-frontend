import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import fi from './locales/fi/translation.json';

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
  },
  //preferred language
  lng: 'en',         
  //use en if detected lng is not available  
  fallbackLng: 'en',  
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
