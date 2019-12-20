import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Meta, Icons } from './app';

class AppContainer extends App {
  render() {
    const {
      Component,
      pageProps
    } = this.props;

    const title = 'FFXIV W Cross HotBar (WXHB) Simulator | XIV Bars';
    const description = 'XIV Bars is a simple app for previewing the Final Fantasy XIV W Cross HotBar (WXHB). Simulate what your hotbar actions could look like for playing Final Fantasy XIV with a gamepad or controller. Use the Class selector to load actions for that class. Drag and drop them to the hotbar slots below.';

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
            canonical="https://xivbars.josebenedicto.com"
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
