import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import analytics from 'lib/analytics';
import Head from 'next/head';
import Script from 'next/script';
import shortDesc from 'lib/shortDesc';
import I18n from 'lib/I18n/locale/en-US';
import renderMeta from 'components/Meta';
import renderFavicon from 'components/Favicon';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from 'components/User/context';
import 'styles/global.scss';

export function App({ Component, pageProps }) {
  const { selectedJob, actions, session } = pageProps;
  const router = useRouter();

  useEffect(() => { analytics.pageview(router.asPath); }, []);

  function generateTitle() {
    if (selectedJob) {
      return `FFXIV ${selectedJob.Name} (${selectedJob.Abbr}) Hotbar Setup Guide | ${I18n.Global.title}`;
    }
    return I18n.Global.title;
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
    return I18n.Global.description;
  }

  const title = generateTitle();
  const canonicalUrl = generateCanonicalUrl();
  const description = generateDescription();

  return (
    <>
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

      <Head>
        <title>{title}</title>
        { renderMeta(title, description, canonicalUrl) }
        { renderFavicon() }
      </Head>

      <main>
        <SessionProvider session={session}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </SessionProvider>
      </main>
    </>
  );
}

App.getInitialProps = async (props) => {
  const { Component, ctx } = props;

  // Return early if there is an error
  // pass the error to the component
  if (ctx.err) return { pageProps: { err: ctx.err } };

  const componentProps = await Component.getInitialProps(ctx);

  return { pageProps: { ...componentProps } };
};
export default App;

App.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape().isRequired
};
