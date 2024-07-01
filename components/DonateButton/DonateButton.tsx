import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import analytics from 'lib/analytics';
import Icon, { Icons } from 'components/Icon';

import styles from './DonateButton.module.scss';

export default function DonateButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  function handleDonate(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    analytics.event({
      action: 'click',
      params: { id: 'donate' }
    });
    router.push(e.currentTarget.getAttribute('href')!);
  }

  function handleDismiss() {
    setHidden(true);
  }

  return (
    <div className={styles.wrapper} data-hidden={hidden}>
      <button
        type="button"
        className={`button btn-icon btn-alt ${styles.dismissBtn}`}
        onClick={handleDismiss}
      >
        <Icon id={Icons.REMOVE} alt={t('Global.close')} />
        <span className="btn-label-hidden">{t('Global.close')}</span>
      </button>
      <a
        href="https://www.buymeacoffee.com/bejezus"
        target="_blank"
        rel="noreferrer"
        onClick={handleDonate}
        className={`${styles.donateLink} button btn-primary`}
      >
        <span className={styles.donateLabel}>
          <b>Donate if you like this app!</b>
          <br />
          Donations help keep the servers up!
        </span>
      </a>
    </div>
  );
}
