import {
  Html, Head, Main, NextScript
} from 'next/document';
import Script from 'next/script';
import renderFavicon from 'components/Favicon';

export default function Document() {
  return (
    <Html>
      <Head>
        { renderFavicon() }
        { process.env.NEXT_PUBLIC_GOOGLE_ADSENSE && (
          <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE} />
        )}

        <meta name="keywords" content="hotbar cross ffxiv endwalker simulator xhb wxhb controller xiv fantasy final tool hotbars simulate planner interface configurations pc ps4 ps5 layouts keymaps keymapping keybinds keybindings" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="icons/favicon-144x144.png" />
        <meta name="msvalidate.01" content="1C49C656556D4EC56E43522F297886AF" />

        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <body>
        <Main />
        <NextScript />
        {/* <!-- Google AdSense --> */}
        { process.env.NEXT_PUBLIC_GOOGLE_ADSENSE && (
        <Script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        )}

        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "${process.env.NEXT_PUBLIC_GA_ID}");
          `}
        </Script>
      </body>
    </Html>
  );
}
