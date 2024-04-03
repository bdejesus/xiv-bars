import React, { useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import analytics from 'lib/analytics';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import I18n from 'lib/I18n/locale/en-US';
import renderMeta from 'components/Meta';
import renderFavicon from 'components/Favicon';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from 'components/User/context';
import { SystemContextProvider } from 'components/System';
import { AppContextProvider } from 'components/App/context';
import Avatar from 'components/Avatar';
import { ErrorBoundary } from 'react-error-boundary';

import 'styles/global.scss';

function App({ Component, pageProps }: AppProps) {
  const { selectedJob, session } = pageProps;
  const router = useRouter();

  useEffect(() => { analytics.pageview(router.asPath); }, []);

  function generateTitle() {
    if (selectedJob) {
      return `FFXIV ${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup Guide | ${I18n.Global.title}`;
    }
    return I18n.Global.title;
  }

  function generateDescription() {
    return I18n.Global.description;
  }

  const pageTitle = generateTitle();
  const description = generateDescription();

  return (
    <ErrorBoundary fallback={(
      <div className="container container-sm panel panel-white mt-xl">
        <div className="system-message fail text-md">
          {I18n.Error.generic.title}
        </div>

        <div className="section mt-md mb-md text-center pad-lg mb-0">
          <p className="text-xl">{I18n.Error.generic.body}</p>

          <a className="button btn-alt btn-inline mb-lg" href="/">
            {I18n.Error.generic.go_back}
          </a>

          <div className="text-center">
            <Avatar img="av30.png" />
          </div>
        </div>
      </div>
    )}
    >
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
              </AppContextProvider>
            </UserProvider>
          </SessionProvider>
        </SystemContextProvider>
      </main>
    </ErrorBoundary>
  );
}

export default appWithTranslation(App);
