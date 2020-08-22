import React from 'react';
import BuyMeABeer from 'components/BuyMeABeer';
import styles from './styles.module.scss';

function Footer() {
  return (
    <div className={`container ${styles.container}`}>
      <div>
        <BuyMeABeer />
      </div>
      <p>
        <a href="https://github.com/bdejesus/xiv-bars/issues/new">Request a feature or submit a bug report</a> • <a href="https://github.com/bdejesus/xiv-bars">GitHub</a>
      </p>
      <p>
        <a href="https://xivapi.com/">Powered by XIVAPI</a>
      </p>
      <p>
        All Final Fantasy XIV content is property of Square Enix Co., LTD
      </p>
    </div>
  );
}

export default Footer;
