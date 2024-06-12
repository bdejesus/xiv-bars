import React, { useState } from 'react';
import { useAppState } from 'components/App/context';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

interface Props {
  action?: 'new'
}

export default function JobMenu({ action }:Props) {
  const tabs = {
    DowDom: 'DoW/DoM',
    DohDol: 'DoH/DoL'
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

      <div className={styles.section} id="DowDom" data-active={selectedTabId === 'DowDom'}>
        <h3>DoW/DoM</h3>

        <div className={styles.categories}>
          <JobsList
            title="Tank"
            jobs={tanks}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title="Healer"
            jobs={healers}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title="Melee DPS"
            jobs={melee}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title="Range DPS"
            jobs={range}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title="Magic DPS"
            jobs={mages}
            className={styles.jobList}
            action={action}
          />
        </div>
      </div>

      <div className={styles.section} id="DohDol" data-active={selectedTabId === 'DohDol'}>
        <h3>DoH/DoL</h3>
        <div className={styles.categories}>
          <JobsList
            title="Crafter"
            jobs={DoH}
            className={styles.jobList}
            action={action}
          />
          <JobsList
            title="Gatherer"
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
