import React from 'react';
import styles from './styles.module.scss';

function BuyMeABeer() {
  return (
    <div>
      <a
        className={styles.button}
        href="https://www.buymeacoffee.com/bejezus"
      >
        <span className={styles.icon}>Cheers!</span>
        <span>
          If you find this tool useful, please consider buying me a beer
        </span>
      </a>
    </div>
  );
}

export default BuyMeABeer;
