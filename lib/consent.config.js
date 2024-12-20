import CookieConsent from 'vanilla-cookieconsent';
import { sendGTMEvent } from '@next/third-parties/google';

export const consentConfig = {
  guiOptions: {
    consentModal: {
      position: 'bottom left'
    }
  },

  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true // this category cannot be disabled
    },
    analytics: {
      enabled: false
    },
    ads: {
      enabled: false
    }
  },

  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'We use cookies',
          description: 'Cookie modal description',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage Individual preferences'
        },
        preferencesModal: {
          title: 'Manage cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          sections: [
            {
              title: 'Somebody said ... cookies?',
              description: 'I want one!'
            },
            {
              title: 'Strictly Necessary cookies',
              description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',

              // this field will generate a toggle linked to the 'necessary' category
              linkedCategory: 'necessary'
            },
            {
              title: 'Performance and Analytics',
              description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
              linkedCategory: 'analytics'
            },
            {
              title: 'Advertisement',
              description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
              linkedCategory: 'ads'
            },
            {
              title: 'More information',
              description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
            }
          ]
        }
      }
    }
  },

  onModalReady: () => {
    sendGTMEvent('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
  },

  onConsent: () => {
    if (CookieConsent.acceptedCategory('analytics')) {
      // Analytics category enabled
      sendGTMEvent('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    if (CookieConsent.acceptedService('Google Analytics', 'analytics')) {
      // Google Analytics enabled
      sendGTMEvent('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    if (CookieConsent.acceptedCategory('ads')) {
      // Google Ads enabled
      sendGTMEvent('consent', 'update', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        ad_storage: 'granted',
      });
    }

    if (CookieConsent.acceptedService('Google AdSense', 'ads')) {
      // Google Ads enabled
      sendGTMEvent('consent', 'update', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        ad_storage: 'granted',
      });
    }
  }
};

export default consentConfig;
