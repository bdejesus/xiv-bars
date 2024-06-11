import React, { useEffect } from 'react';
import { appWithTranslation, useTranslation, UserConfig } from 'next-i18next';
import { useRouter } from 'next/router';
import { Roboto, Noto_Sans_Mono } from 'next/font/google';
import analytics from 'lib/analytics';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import renderMeta from 'components/Meta';
import renderFavicon from 'components/Favicon';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from 'components/User/context';
import { SystemContextProvider } from 'components/System';
import { AppContextProvider } from 'components/App/context';
import Avatar from 'components/Avatar';
import LoadScreen from 'components/LoadScreen';
import { ErrorBoundary } from 'react-error-boundary';
import nextI18NextConfig from '../next-i18next.config.js';

import '../styles/global.scss';

const emptyInitialI18NextConfig: UserConfig = {
  i18n: {
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
    locales: nextI18NextConfig.i18n.locales,
  },
};

const roboto = Roboto({ weight: ['100', '300', '400', '500', '700'], subsets: ['latin'] });
const notoSansMono = Noto_Sans_Mono({ weight: ['700'], subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation('common');
  const { selectedJob, session } = pageProps;
  const router = useRouter();

  useEffect(() => { analytics.pageview(router.asPath); }, []);

  function generateTitle() {
    if (selectedJob) {
      return `FFXIV ${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup Guide | ${t('Global.title')}`;
    }
    return t('Global.title');
  }

  function generateDescription() {
    return t('Global.description');
  }

  const pageTitle = generateTitle();
  const description = generateDescription();

  return (
    <ErrorBoundary fallback={(
      <div className="container container-sm panel panel-white mt-xl">
        <div className="system-message fail text-md">
          {t('Error.generic.title')}
        </div>

        <div className="mt-md mb-md text-center pad-lg mb-0">
          <p className="text-xl">{t('Error.generic.body')}</p>

          <a className="button btn-alt btn-inline mb-lg" href="/">
            {t('Error.generic.go_back')}
          </a>

          <div className="text-center">
            <Avatar img="av30.png" />
          </div>
        </div>
      </div>
    )}
    >
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
        .tag, .job-abbr {
          font-family: ${notoSansMono.style.fontFamily};
        }
      `}
      </style>

      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "${process.env.NEXT_PUBLIC_GA_ID}");
        `}
      </Script>

      <Head>
        <title>{pageTitle}</title>
        { renderMeta(pageTitle, description) }
        { renderFavicon() }
      </Head>

      <main>
        <SystemContextProvider>
          <SessionProvider session={session}>
            <UserProvider>
              <AppContextProvider>
                <Component {...pageProps} />
                <LoadScreen />
              </AppContextProvider>
            </UserProvider>
          </SessionProvider>
        </SystemContextProvider>
      </main>
    </ErrorBoundary>
  );
}

export default appWithTranslation(App, emptyInitialI18NextConfig);
