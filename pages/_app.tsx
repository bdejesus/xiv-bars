import React, { useEffect } from 'react';
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
import { ErrorBoundary } from 'react-error-boundary';

import 'styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
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
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
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
        <SessionProvider session={session}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </SessionProvider>
      </main>
    </ErrorBoundary>
  );
}
