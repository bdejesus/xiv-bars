import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import shortDesc from 'lib/shortDesc';
import { Meta, Icons } from './includes';

import './global.scss';

class AppContainer extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { selectedJob, actions, query } = pageProps;

    function generateTitle() {
      if (query && query.job) {
        return `${selectedJob.Name} [${selectedJob.Abbr}] Hotbar Setup | FFXIV W Cross Hotbar (WXHB) Simulator | XIV Bars`;
      }
      return 'FFXIV W Cross HotBar (WXHB) Simulator | XIV Bars';
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
      return 'XIV Bars is an app for previewing the Final Fantasy XIV W Cross Hotbar (WXHB) setup. Simulate and plan out what your hotbar setup could look like with a gamepad or controller. Use the Class selector to load actions for that class. Drag and drop them to the hotbar slots below.';
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
