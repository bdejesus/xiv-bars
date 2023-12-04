import { useState } from 'react';
import I18n from 'lib/I18n/locale/en-US';
import analytics from 'lib/analytics';
import styles from './Donate.module.scss';

export function Donate() {
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
        onClick={() => analytics.event({
          action: 'click',
          params: { method: 'donate' }
        })}
      >
        <span className={styles.icon}>{I18n.BuyMeABeer.cheers}</span>
        <span>
          {I18n.BuyMeABeer.tips_appreciated}
        </span>
      </a>
    </div>
  );
}

export default Donate;
