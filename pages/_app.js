import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import shortDesc from 'lib/shortDesc';
import siteData from 'config/app.config';
import { Meta, Icons } from './includes';

import './global.scss';

class AppContainer extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { selectedJob, actions, query } = pageProps;

    function generateTitle() {
      if (query && query.job) {
        return `${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup | ${siteData.global.name}`;
      }
      return siteData.global.name;
    }

    function generateCanonicalUrl() {
      if (query && query.job) {
        return `https://xivbars.bejezus.com/job/${selectedJob.Abbr}`;
      }
      return 'https://xivbars.bejezus.com';
    }

    function generateDescription() {
      if (query && query.job) {
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
          <Icons />
        </Head>

        <main>
          <Component {...pageProps} />
        </main>
      </>
    );
  }
}

export default AppContainer;
