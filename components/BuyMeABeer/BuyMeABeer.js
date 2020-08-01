import React from 'react';
import styles from './styles.scss';

function BuyMeABeer() {
  return (
    <div>
      <a 
        className={styles.button}
        target="_blank" 
        href="https://www.buymeacoffee.com/bejezus"
      >
        <span className={styles.icon}>🍺</span>
        <span>
          If you find this tool useful, please consider buying me a beer
        </span>
      </a>
    </div>
  )
};

export default BuyMeABeer;
