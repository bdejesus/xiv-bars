import React, { useState, useEffect } from 'react';
import { SortType, LayoutListOptions } from 'types/Layout';
import styles from './ViewControl.module.scss';

export const filters:string[] = ['XHB', 'HB', 'PVP', 'PVE'];
export const defaultView:LayoutListOptions = {
  sortBy: 'recent',
  filters
};

interface ViewControlProps {
  id: string,
  onChange: React.Dispatch<React.SetStateAction<LayoutListOptions>>
}

export default function ViewControl({ id, onChange }:ViewControlProps) {
  const [viewOptions, setViewOptions] = useState<LayoutListOptions>(defaultView);
  function handleControlChange(e:React.FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    if (target.getAttribute('name') === 'sort') {
      setViewOptions({ ...viewOptions, sortBy: target.value as SortType });
    } else if (target.getAttribute('type') === 'checkbox') {
      if (target.checked) {
        setViewOptions({ ...viewOptions, filters: [...viewOptions.filters, target.value] });
      }
      if (!target.checked) {
        const updatedFilters = viewOptions.filters.filter((f) => f !== target.value);
        setViewOptions({ ...viewOptions, filters: updatedFilters });
      }
    }
  }

  useEffect(() => {
    onChange(viewOptions);
  }, [viewOptions]);

  return (
    <form className={styles.container}>
      <div className={[styles.controlGroup, styles.controlSort].join(' ')}>
        <div className={styles.groupLabel}>Sort by</div>

        <label className={styles.control} htmlFor={`${id}-sort-recent`}>
          <input
            type="radio"
            name={`${id}-sort`}
            id={`${id}-sort-recent`}
            value="recent"
            onChange={handleControlChange}
            defaultChecked
          />
          <span>Most Recent</span>
        </label>

        <label className={styles.control} htmlFor={`${id}-sort-hearts`}>
          <input
            type="radio"
            name={`${id}-sort`}
            id={`${id}-sort-hearts`}
            value="hearts"
            onChange={handleControlChange}
          />
          <span>Most Hearts</span>
        </label>
      </div>

      <div className={[styles.controlGroup, styles.controlFilter].join(' ')}>
        <div className={styles.groupLabel}>
          Filter
        </div>

        { filters.map((filter) => (
          <label
            className={styles.control}
            key={`filter-${filter}`}
            htmlFor={`${id}-filter-${filter}`}
          >
            <input
              type="checkbox"
              value={filter}
              name={`${id}-filter-${filter}`}
              id={`${id}-filter-${filter}`}
              onChange={handleControlChange}
              defaultChecked
            />
            <span>{ filter }</span>
          </label>
        )) }
      </div>
    </form>
  );
}
