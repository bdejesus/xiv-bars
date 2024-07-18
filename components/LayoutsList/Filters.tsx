import React from 'react';
import styles from './Filters.module.scss';

export default function Filters() {
  const filters = ['XHB', 'HB', 'PVE', 'PVP'];

  return (
    <div className={styles.container}>
      <div className={[styles.controlGroup, styles.controlSort].join(' ')}>
        <div className={styles.groupLabel}>Sort by</div>

        <label className={styles.control} htmlFor="sort-recent">
          <input
            type="radio"
            name="sort"
            id="sort-recent"
            value="recent"
            defaultChecked
          />
          Most Recent
        </label>

        <label className={styles.control} htmlFor="sort-heart">
          <input
            type="radio"
            name="sort"
            id="sort-heart"
            value="heart"
          />
          Most Hearts
        </label>
      </div>

      <div className={[styles.controlGroup, styles.controlFilter].join(' ')}>
        <div className={styles.groupLabel}>
          Filter
        </div>

        { filters.map((filter) => (
          <label
            className={styles.control}
            key={`${filter}-XHB`}
            htmlFor={`${filter}-XHB`}
          >
            <input
              type="checkbox"
              value={filter}
              name={`${filter}-XHB`}
              id={`${filter}-XHB`}
              defaultChecked
            />
            { filter }
          </label>
        )) }
      </div>
    </div>
  );
}
