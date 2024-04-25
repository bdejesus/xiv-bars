import { useTranslation } from 'next-i18next';
import { useSystemState } from 'components/System/context';
import styles from './LoadScreen.module.scss';

export function LoadScreen() {
  const { isLoading } = useSystemState();
  const { t } = useTranslation();

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
