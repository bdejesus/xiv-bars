import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import shortDesc from 'lib/shortDesc';
import I18n from 'lib/I18n/locale/en-US';
import renderMeta from 'components/Meta';
import renderFavicon from 'components/Favicon';

import 'styles/global.scss';

class AppContainer extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { selectedJob, actions } = pageProps;

    function generateTitle() {
      if (selectedJob) {
        return `${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup | ${I18n.Global.title}`;
      }
      return [I18n.Global.brand, I18n.Global.title].join(' • ');
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
          <Component {...pageProps} />
        </main>
      </>
    );
  }
}

export default AppContainer;
