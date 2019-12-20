import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { Meta, Icons } from './app';
import AppContextProvider from './app-context';

import styles from './app/styles.scss';

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
        <AppContextProvider>
          <main>
            <div className={`${styles.container} ${styles.primary}`}>
              <h1>XIV Bars</h1>
              <p>A Final Fantasy XIV W Cross HotBar (WXHB) Preview Tool.</p>
              <p>
                Simulate what your WXHB actions could look like when playing
                Final Fantasy XIV with a gamepad or controller. Use the Job
                selector to load actions for that class and Drag them into
                the hotbar slots below like you would in the game.
              </p>
              <Component {...pageProps} />
            </div>

            <div className={`${styles.container} ${styles.links}`}>
              <h3>
                <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
                  Cross Hotbar Settings: Auto-switching for Battle
                </a>
              </h3>

              <p>
                How to set your Cross Hotbars in Controller Mode to auto-switch
                to a combat hotbar when entering battle stance.
              </p>

              <p>
                If you play in <b>Controller Mode</b>, you can set your Cross
                Hotbars to automatically switch to a different Hotbar whenever
                you go into battle stance. This frees you up from having to
                manually switch to the correct hotbar every time you&apos;re
                coming in and out of combat.
              </p>

              <p>
                <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
                  Read more...
                </a>
              </p>
            </div>

            <div className={`${styles.container} ${styles.info}`}>
              <p>
                <a href="https://xivapi.com/">Powered by XIVAPI</a>
              </p>
              <p>
                All Final Fantasy XIV content is property of Square Enix Co.,
                LTD
              </p>
            </div>
          </main>
        </AppContextProvider>
      </>
    );
  }
}

export default AppContainer;
