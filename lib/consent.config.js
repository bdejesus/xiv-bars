import CookieConsent from 'vanilla-cookieconsent';

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

  onConsent: () => {
    if (CookieConsent.acceptedCategory('analytics')) {
      // Analytics category enabled
    }

    if (CookieConsent.acceptedService('Google Analytics', 'analytics')) {
      // Google Analytics enabled
    }

    if (CookieConsent.acceptedService('ads')) {
      // Google Analytics enabled
    }

    if (CookieConsent.acceptedService('Google AdSense', 'ads')) {
      // Google Analytics enabled
    }
  }
};

export default consentConfig;
