import * as CookieConsent from 'vanilla-cookieconsent';

const modalPosition:CookieConsent.ConsentModalPosition = 'bottom left';

export const consentConfig = {
  guiOptions: {
    consentModal: {
      position: modalPosition
    }
  },

  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true // this category cannot be disabled
    },
    analytics: {
      enabled: true
    },
    ads: {
      enabled: true
    }
  },

  language: {
    default: 'en',
    translations: {
      en: '/locales/en/consent.json',
      de: '/locales/de/consent.json',
      fr: '/locales/fr/consent.json',
      ja: '/locales/ja/consent.json'
    }
  },

  onConsent: () => {
    try {
      if (CookieConsent.acceptedCategory('analytics')) {
        // Analytics category enabled
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      }

      if (CookieConsent.acceptedCategory('ads')) {
        // Google Ads enabled
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('consent', 'update', {
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          ad_storage: 'granted',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export default consentConfig;
