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
      enabled: false
    },
    ads: {
      enabled: false,
      ad_storage: false,
      ad_user_data: false,
      ad_personalization: false
    }
  },

  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Privacy & Cookie Preferences',
          description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <a href="/privacy">Privacy Statement</a>.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Customize'
        },
        preferencesModal: {
          title: 'Customize Privacy & Cookie Preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          sections: [
            {
              description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.'
            },
            {
              title: 'Strictly Necessary cookies',
              description: 'These cookies are essential for the proper functioning of the website and cannot be disabled. <ul><li><code>Host-next-auth.*</code> – Used for user authentication and session state</li><li><code>Secure-next-auth.*</code> – Used for user authentication and session state</li></ul>',
              linkedCategory: 'necessary'
            },
            {
              title: 'Analytics',
              description: 'The <code>_ga</code> cookie collects information about how you use our website during your visit. All of the data is anonymized and cannot be used to identify you.',
              linkedCategory: 'analytics'
            },
            {
              title: 'Advertisement',
              description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.<br/><br/> Cookies named <code>_gads</code>, <code>_gpi</code>, and <code>_eoi</code> are third-party cookies set on the website domain. These cookies are used by Google Ad Manager on behalf of the website to support: <ul><li>Programmatic buyers frequency capping and ads personalization</li><li>Reservation frequency capping</li></ul>',
              linkedCategory: 'ads'
            },
            {
              title: 'More information',
              description: 'For any queries in relation to the policy on cookies and your choices, please read our <a href="/privavcy">Privacy Statement</a> or  <a href="mailto:support@xivbars.com">contact us</a>'
            }
          ]
        }
      }
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
