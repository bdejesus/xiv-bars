import { useAppState } from 'components/App/context';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

interface Props {
  action?: 'new'
}

export default function JobMenu({ action }:Props) {
  const { jobs } = useAppState();

  if (!jobs) return null;

  const tanks = jobs.filter((job) => job.Role === 'TANK');
  const healers = jobs.filter((job) => job.Role === 'HEAL');
  const mages = jobs.filter((job) => job.Role?.match(/MDPS/));
  const melee = jobs.filter((job) => job.Role?.match('PDPS'));
  const range = jobs.filter((job) => job.Role?.match('RDPS'));

  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <div className={styles.container}>
      <div className={styles.section}>
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

      <div className={styles.section}>
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
