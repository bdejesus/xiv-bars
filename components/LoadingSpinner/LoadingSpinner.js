import React from 'react';

import styles from './styles.scss';

function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src="/mog_trumpet.png" alt="" />
      </div>
    </div>
  );
}

export default LoadingSpinner;
