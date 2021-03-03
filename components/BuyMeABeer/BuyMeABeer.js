import { useState } from 'react';
import I18n from 'lib/I18n/locale/en-US';
import styles from './BuyMeABeer.module.scss';

function BuyMeABeer() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.container} data-collapsed={collapsed}>
      <button
        className={styles.collapseBtn}
        type="button"
        onClick={() => setCollapsed(true)}
      >
        &times;
      </button>
      <a
        className={styles.button}
        href="https://www.buymeacoffee.com/bejezus"
      >
        <span className={styles.icon}>{I18n.BuyMeABeer.cheers}</span>
        <span>
          <b>{I18n.BuyMeABeer.tips_appreciated}</b>
          <br />
          {I18n.BuyMeABeer.donate}
        </span>
      </a>
    </div>
  );
}

export default BuyMeABeer;
