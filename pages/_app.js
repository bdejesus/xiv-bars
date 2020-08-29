import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import shortDesc from 'lib/shortDesc';
import siteData from 'config/app.config';
import Meta from 'components/Meta';
import Favicon from 'components/Favicon';

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
          <Meta
            title={title}
            description={description}
            canonical={canonicalUrl}
          />
          <Favicon />
        </Head>

        <main>
          <Component {...pageProps} />
        </main>
      </>
    );
  }
}

export default AppContainer;
