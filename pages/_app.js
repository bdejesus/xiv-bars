import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import shortDesc from 'lib/shortDesc';
import siteData from 'config/app.config';
import renderMeta from 'components/Meta';
import renderFavicon from 'components/Favicon';

import 'styles/global.scss';

class AppContainer extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { selectedJob, actions } = pageProps;

    function generateTitle() {
      if (selectedJob) {
        return `${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup | ${siteData.global.name}`;
      }
      return siteData.global.name;
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
      return siteData.global.description;
    }

    const title = generateTitle();
    const canonicalUrl = generateCanonicalUrl();
    const description = generateDescription();

    return (
      <>
        <Head>
          <title>
            {title}
          </title>
          {renderMeta(title, description, canonicalUrl)}
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
