/* eslint-disable no-restricted-globals */
import Head from 'next/head';
import I18n from 'lib/I18n/locale/en-US';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import styles from './Index.module.scss';

function Error500() {
  const pageTitle = `${I18n.Pages.NotFound.title} • ${I18n.Pages.NotFound.status} • XIVBARS`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.errorPage}>
        <AppContextProvider>
          <GlobalHeader />
        </AppContextProvider>

        <div className={styles.main}>
          <div className="container section">
            <small>{I18n.Pages.NotFound.status}</small>
            <h1>{I18n.Pages.NotFound.title}</h1>
            <p>{I18n.Pages.NotFound.body}</p>

            <ul>
              <li>
                <a href="/" onClick={() => history.back()}>
                  {I18n.Pages.NotFound.option1}
                </a>
              </li>

              <li>
                <a href="https://github.com/bdejesus/xiv-bars/issues">
                  {I18n.Pages.NotFound.option2}
                </a>
              </li>

              <li>
                <a href="/">
                  {I18n.Pages.NotFound.option3}
                </a>
              </li>
            </ul>

          </div>
        </div>

        <Footer />
        <LoadScreen />
      </div>
    </>
  );
}

export default Error500;
