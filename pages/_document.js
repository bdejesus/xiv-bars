/* eslint-disable react/no-danger */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript
} from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
