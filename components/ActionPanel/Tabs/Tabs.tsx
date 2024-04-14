import React from 'react';
import { useTranslation } from 'next-i18next';

import styles from './Tabs.module.scss';

interface Props {
  activeTab: string,
  onTabClick: React.MouseEventHandler<HTMLButtonElement>
}

export function Tabs({ activeTab, onTabClick }: Props) {
  const { t } = useTranslation();

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
            {t('ActionPanel.job')}
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
            {t('ActionPanel.general')}
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
            {t('ActionPanel.menu')}
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
            {t('ActionPanel.macros')}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Tabs;
