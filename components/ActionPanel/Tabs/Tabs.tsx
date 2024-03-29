import React from 'react';

import styles from './Tabs.module.scss';

interface Props {
  activeTab: string,
  onTabClick: React.MouseEventHandler<HTMLButtonElement>
}

export function Tabs({ activeTab, onTabClick }: Props) {
  return (
    <div className={styles.tabs}>
      <ul className={styles.tabItems}>
        <li>
          <button
            type="button"
            className={`${styles.tabButton} button btn-alt`}
            data-target="panel-actions"
            data-active={activeTab === 'panel-actions'}
            onClick={onTabClick}
          >
            Job
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`${styles.tabButton} button btn-alt`}
            data-target="panel-general"
            data-active={activeTab === 'panel-general'}
            onClick={(e) => onTabClick(e)}
          >
            General
          </button>
        </li>

        <li>
          <button
            type="button"
            className={`${styles.tabButton} button btn-alt`}
            data-target="panel-menu"
            data-active={activeTab === 'panel-menu'}
            onClick={(e) => onTabClick(e)}
          >
            Menu
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`${styles.tabButton} button btn-alt`}
            data-target="panel-macros"
            data-active={activeTab === 'panel-macros'}
            onClick={(e) => onTabClick(e)}
          >
            Macros
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Tabs;
