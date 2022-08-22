/* eslint-disable no-restricted-globals */
import Head from 'next/head';
import GlobalHeader from 'components/GlobalHeader';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import styles from './Index.module.scss';

function Error500() {
  return (
    <>
      <Head>
        <title>500 – Something went wrong • XIVBars</title>
      </Head>
      <div className={styles.errorPage}>
        <GlobalHeader />

        <div className={styles.main}>
          <div className="container section">
            <small>500 SERVER ERROR</small>
            <h1>Yikes! Something went wrong</h1>

            <p>
              The error has been logged and we’ll try to fix it as soon as possible.
            </p>

            <ul>
              <li>
                <a href="/" onClick={() => history.back()}>
                  Go back to the previous page and try again
                </a>
              </li>
              <li>
                <a href="https://github.com/bdejesus/xiv-bars/issues">
                  Check on the status of this issue or report a bug
                </a>
              </li>
              <li>
                <a href="/">Return to the home page</a>
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
