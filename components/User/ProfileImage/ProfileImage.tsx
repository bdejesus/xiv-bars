import React from 'react';

import styles from './ProfileImage.module.scss';

export default function ProfileImage({ src, title }) {
  return (
    <div className={styles.wrapper}>
      <img src={src} alt={title} />
    </div>
  );
}
