import React, { useState } from 'react';
import { useAppState } from 'components/App/context';
import { useTranslation } from 'next-i18next';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

interface Props {
  action?: 'new'
}

export default function JobMenu({ action }:Props) {
  const { t } = useTranslation();
  const tabs = {
    DowDom: t('JobSelect.dow_dom'),
    DohDol: t('JobSelect.doh_dol')
  };
  const { jobs } = useAppState();
  const [selectedTabId, setSelectedTabId] = useState(Object.keys(tabs)[0]);

  if (!jobs) return null;

  const tanks = jobs.filter((job) => job.Role === 'TANK');
  const healers = jobs.filter((job) => job.Role === 'HEAL');
  const mages = jobs.filter((job) => job.Role?.match(/MDPS/));
  const melee = jobs.filter((job) => job.Role?.match('PDPS'));
  const range = jobs.filter((job) => job.Role?.match('RDPS'));

  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  function handleTabClick(e:React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const tabId = e.currentTarget.getAttribute('href')!.slice(1) as keyof typeof tabs;
    setSelectedTabId(tabId);
  }

  return (
    <div className={styles.container}>
      <ul className={styles.tabs}>
        { Object.entries(tabs).map(([tabId, tabTitle]) => (
          <li key={tabId}>
            <a
              role="button"
              href={`#${tabId}`}
              className={[styles.tab, 'button'].join(' ')}
              onClick={handleTabClick}
              data-active={selectedTabId === tabId}
            >
              {tabTitle}
            </a>
          </li>
        ))}
      </ul>

      <div
        className={styles.section}
        id="DowDom"
        data-active={selectedTabId === 'DowDom'}
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <h3 itemProp="name">{t('JobSelect.dow_dom')}</h3>

        <div className={styles.categories}>
          <JobsList
            title={t('JobSelect.tank')}
            jobs={tanks}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title={t('JobSelect.healer')}
            jobs={healers}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title={t('JobSelect.melee_dps')}
            jobs={melee}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title={t('JobSelect.range_dps')}
            jobs={range}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title={t('JobSelect.magic_dps')}
            jobs={mages}
            className={styles.jobList}
            action={action}
          />
        </div>
      </div>

      <div
        className={styles.section}
        id="DohDol"
        data-active={selectedTabId === 'DohDol'}
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <h3 itemProp="name">{t('JobSelect.doh_dol')}</h3>

        <div className={styles.categories}>
          <JobsList
            title={t('JobSelect.crafter')}
            jobs={DoH}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title={t('JobSelect.gatherer')}
            jobs={DoL}
            className={styles.jobList}
            action={action}
          />
        </div>
      </div>
    </div>
  );
}

JobMenu.defaultProps = {
  action: undefined
};
