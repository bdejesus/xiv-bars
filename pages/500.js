/* eslint-disable no-restricted-globals */
import Head from 'next/head';
import I18n from 'lib/I18n/locale/en-US';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import styles from './Index.module.scss';

function Error500() {
  return (
    <>
      <Head>
        <title>
          {I18n.Pages.ServerError.title} • {I18n.Pages.ServerError.status} • XIVBARS
        </title>
      </Head>

      <div className={styles.errorPage}>
        <GlobalHeader />

        <div className={styles.main}>
          <div className="container section">
            <small>{I18n.Pages.ServerError.status}</small>
            <h1>{I18n.Pages.ServerError.title}</h1>
            <p>{I18n.Pages.ServerError.body}</p>

            <ul>
              <li>
                <a href="/" onClick={() => history.back()}>
                  {I18n.Pages.ServerError.option1}
                </a>
              </li>

              <li>
                <a href="https://github.com/bdejesus/xiv-bars/issues">
                  {I18n.Pages.ServerError.option2}
                </a>
              </li>

              <li>
                <a href="/">
                  {I18n.Pages.ServerError.option3}
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
