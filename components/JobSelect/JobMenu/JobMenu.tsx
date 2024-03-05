import { useAppState } from 'components/App/context';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

export function JobMenu() {
  const { jobs } = useAppState();

  if (!jobs) return null;

  const DoW = jobs.filter((job) => job.Discipline === 'DOW');
  const DoM = jobs.filter((job) => job.Discipline === 'DOM');
  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <ul className={styles.jobGroupList}>
      <li>
        <JobsList abbr="DoW" title="Disciple of War" jobs={DoW} />
      </li>
      <li>
        <JobsList abbr="DoM" title="Disciple of Magic" jobs={DoM} />
      </li>
      <li className={styles.crafterJobs}>
        <JobsList abbr="DoH" title="Disciple of the Hand" jobs={DoH} />
      </li>
      <li className={styles.crafterJobs}>
        <JobsList abbr="DoL" title="Disciple of the Land" jobs={DoL} />
      </li>
    </ul>
  );
}

export default JobMenu;
