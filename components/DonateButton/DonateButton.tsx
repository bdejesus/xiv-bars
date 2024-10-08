import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import CloseButton from 'components/CloseButton';
import analytics from 'lib/analytics';
import styles from './DonateButton.module.scss';

export default function DonateButton() {
  const router = useRouter();
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);

  function handleDonate(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    analytics.event({
      action: 'click',
      params: { id: 'donate' }
    });
    router.push(e.currentTarget.getAttribute('href')!);
  }

  return (
    <div className={styles.wrapper} data-hidden={hidden}>
      <CloseButton className={styles.dismissBtn} onClick={() => setHidden(true)} />
      <a
        href="https://www.buymeacoffee.com/bejezus"
        target="_blank"
        rel="noreferrer"
        onClick={handleDonate}
        className={`${styles.donateLink} button btn-primary`}
      >
        <span className={styles.donateLabel}>
          <b>{t('Donate.title')}</b>
          <br />
          {t('Donate.subtitle')}
        </span>
      </a>
    </div>
  );
}
