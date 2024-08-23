import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import styles from './EorzeaProfile.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

export function EorzeaProfile() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <a
        href="https://dashboard.twitch.tv/extensions/bsdr8tkgubqusuao9ixx6wjyhxy8je-1.1.1"
        target="_blank"
        rel="noreferrer"
        className={styles.panel}
      >
        <div className={styles.image}>
          <img src="/images/ffxiv-screenshot.png" alt="" />
        </div>

        <div className={styles.body}>
          <h2>
            {t('EorzeaProfile.title')}
          </h2>

          <p className={styles.subtitle}>
            {t('EorzeaProfile.body')}
          </p>

          <div className={styles.cta}>
            {t('EorzeaProfile.cta')}
          </div>
        </div>
      </a>

      <AdUnit id="ad-EorzeaProfile" className="mt-xl" />
    </div>
  );
}

export default EorzeaProfile;
