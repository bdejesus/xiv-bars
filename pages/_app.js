import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Meta, Icons } from './app';

class AppContainer extends App {
  render() {
    const { Component, pageProps } = this.props;
    const { selectedJob, query } = pageProps;

    function generateTitle() {
      if (query && query.job) {
        return `${selectedJob.Name} [${selectedJob.Abbr}] | FFXIV W Cross HotBar (WXHB) Simulator | XIV Bars`;
      }
      return 'FFXIV W Cross HotBar (WXHB) Simulator | XIV Bars';
    }

    function generateCanonicalUrl() {
      if (query && query.job) {
        return `https://xivbars.josebenedicto.com/job/${selectedJob.Abbr}`;
      }
      return 'https://xivbars.josebenedicto.com';
    }

    function generateDescription() {
      if (query && query.job) {
        return `W Cross Hotbar (WXHB) simulator for ${selectedJob.Name} (${selectedJob.Abbr}) Final Fantasy XIV Job Class. Simulate what your hotbar actions could look like for playing Final Fantasy XIV with a gamepad or controller. Use the Class selector to load actions for that class. Drag and drop them to the hotbar slots below.`;
      }
      return 'XIV Bars is a simple app for previewing the Final Fantasy XIV W Cross HotBar (WXHB). Simulate what your hotbar actions could look like for playing Final Fantasy XIV with a gamepad or controller. Use the Class selector to load actions for that class. Drag and drop them to the hotbar slots below.';
    }

    const title = generateTitle();
    const canonicalUrl = generateCanonicalUrl();
    const description = generateDescription();

    return (
      <>
        <Head>
          {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-144541753-2"
          />
          {/* eslint-disable-next-line react/no-danger */}
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                dataLayer.push(arguments);
              }
              gtag("js", new Date());
              gtag("config", "UA-144541753-2");
            `
          }}
          />
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
