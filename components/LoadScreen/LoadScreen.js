import React, { useState } from 'react';
import Router from 'next/router';

import styles from './styles.scss';

function LoadScreen() {
  const [isLoading, setIsLoading] = useState(false);
  // TODO: Fix events memory leak here
  Router.events.on('routeChangeStart', () => setIsLoading(true));
  Router.events.on('routeChangeComplete', () => setIsLoading(false));
  // eslint-disable-next-line no-console
  Router.events.on('routeChangeError', () => console.error('error'));

  return (
    <div className={styles.container} aria-hidden={!isLoading}>
      <div className={styles.wrapper}>
        <img src="/images/mog_trumpet.png" alt="" />
        <div className={styles.title}>Loading...</div>
      </div>
    </div>
  );
}

export default LoadScreen;
