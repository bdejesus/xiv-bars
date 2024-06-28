import React from 'react';
import { useRouter } from 'next/router';
import analytics from 'lib/analytics';

import styles from './DonateButton.module.scss';

export default function DonateButton() {
  const router = useRouter();

  function handleDonate(e:React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    analytics.event({
      action: 'click',
      params: { id: 'donate' }
    });
    router.push(e.currentTarget.getAttribute('href')!);
  }

  return (
    <div className={styles.wrapper}>
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
