import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSystemDispatch, useSystemState } from 'components/System/context';
import { SystemActions } from 'components/System/actions';
import styles from './LoadScreen.module.scss';

export function LoadScreen() {
  const systemDispatch = useSystemDispatch();
  const { isLoading } = useSystemState();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const loadStart = () => systemDispatch({ type: SystemActions.LOADING_START });
    const loadEnd = () => systemDispatch({ type: SystemActions.LOADING_END });
    router.events.on('routeChangeStart', loadStart);
    router.events.on('routeChangeComplete', loadEnd);

    return () => {
      router.events.off('routeChangeStart', loadStart);
      router.events.off('routeChangeComplete', loadEnd);
    };
  }, [router]);

  return (
    <div className={styles.container} aria-hidden={!isLoading}>
      <div className={styles.wrapper}>
        <img src="/images/mog_trumpet.png" alt="" />
        <div className={styles.title}>{t('Global.loading')}</div>
      </div>
    </div>
  );
}

export default LoadScreen;
