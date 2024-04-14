import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Initialize i18next
i18n.use(initReactI18next).init({
  lng: 'en', // Set the default language here
  resources: {
    en: {
      translation: {
        // Your translations go here
      }
    },
    // Add more languages if needed
  },
  interpolation: {
    escapeValue: false // React already does escaping
  }
});
