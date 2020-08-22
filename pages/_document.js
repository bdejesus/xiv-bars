/* eslint-disable react/no-danger */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
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
          {/* Google AdSense */}
          <script data-ad-client="ca-pub-3274093949320222" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
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
