import React from 'react';
import styles from './Filters.module.scss';

export default function Filters() {
  return (
    <div className={styles.container}>
      <div className={[styles.controlGroup, styles.controlSort].join(' ')}>
        <div className={styles.groupLabel}>Sort by</div>

        <label className={styles.control}>
          <input type="radio" name="sort" value="recent" defaultChecked /> Recent
        </label>

        <label className={styles.control}>
          <input type="radio" name="sort" value="heart" /> Hearts
        </label>
      </div>

      <div className={[styles.controlGroup, styles.controlFilter].join(' ')}>
        <div className={styles.groupLabel}>
          Filter
        </div>

        <label className={styles.control}>
          <input type="checkbox" defaultChecked /> HB
        </label>

        <label className={styles.control}>
          <input type="checkbox" defaultChecked /> XHB
        </label>

        <label className={styles.control}>
          <input type="checkbox" defaultChecked /> PVP
        </label>

        <label className={styles.control}>
          <input type="checkbox" defaultChecked /> PVE
        </label>
      </div>
    </div>
  );
}
