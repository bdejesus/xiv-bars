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
            <small>404 PAGE NOT FOUND</small>
            <h1>This is not the page you’re looking for</h1>

            <p>
              It doesn’t look like the page your looking for exists at this url.
            </p>

            <ul>
              <li>
                <a href="/" onClick={() => history.back()}>
                  Go back to the previous page and try again
                </a>
              </li>
              <li>
                <a href="https://github.com/bdejesus/xiv-bars/issues">
                  Report an issue if you think this page should be here
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
