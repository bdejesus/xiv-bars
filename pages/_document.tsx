import {
  Html, Head, Main, NextScript
} from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* <!-- Google AdSense --> */}
        { process.env.NEXT_PUBLIC_GOOGLE_ADSENSE && (
          <Script
            id="google-adsense"
            async
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
