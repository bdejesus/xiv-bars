import PropTypes from 'prop-types';
import Head from 'next/head';
import Script from 'next/script';
import shortDesc from 'lib/shortDesc';
import I18n from 'lib/I18n/locale/en-US';
import renderMeta from 'components/Meta';
import renderFavicon from 'components/Favicon';
import { SessionProvider } from 'next-auth/react';

import 'styles/global.scss';

function App({ Component, pageProps }) {
  const { selectedJob, actions, session } = pageProps;

  function generateTitle() {
    if (selectedJob) {
      return `${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup | ${I18n.Global.title}`;
    }
    return I18n.Global.title;
  }

  function generateCanonicalUrl() {
    if (selectedJob) {
      return `https://xivbars.bejezus.com/job/${selectedJob.Abbr}`;
    }
    return 'https://xivbars.bejezus.com';
  }

  function generateDescription() {
    if (selectedJob) {
      return shortDesc(selectedJob, actions);
    }
    return I18n.Global.description;
  }

  const title = generateTitle();
  const canonicalUrl = generateCanonicalUrl();
  const description = generateDescription();

  return (
    <>
      {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=UA-144541753-2"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "UA-144541753-2");
        `}
      </Script>

      <Head>
        <title>{title}</title>
        { renderMeta(title, description, canonicalUrl) }
        { renderFavicon() }
      </Head>

      <main>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </>
  );
}

export default App;

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape().isRequired
};
