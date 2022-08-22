import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import I18n from 'lib/I18n/locale/en-US';

import styles from './LoadScreen.module.scss';

export function LoadScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsLoading(true));
    router.events.on('routeChangeComplete', () => setIsLoading(false));

    return () => {
      router.events.off('routeChangeStart', setIsLoading);
      router.events.off('routeChangeComplete', setIsLoading);
    };
  }, [router]);

  return (
    <div className={styles.container} aria-hidden={!isLoading}>
      <div className={styles.wrapper}>
        <img src="/images/mog_trumpet.png" alt="" />
        <div className={styles.title}>{I18n.Global.loading}</div>
      </div>
    </div>
  );
}

export default LoadScreen;
