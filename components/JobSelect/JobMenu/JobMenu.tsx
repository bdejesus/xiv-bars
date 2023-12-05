import type { ClassJobProps } from 'types/ClassJob';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

interface Props {
  jobs: ClassJobProps[]
}

export function JobMenu({ jobs }: Props) {
  const DoW = jobs.filter((job) => job.Discipline === 'DOW');
  const DoM = jobs.filter((job) => job.Discipline === 'DOM');
  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <ul className={styles.jobGroupList}>
      <li>
        <JobsList title="DoW" jobs={DoW} />
      </li>
      <li>
        <JobsList title="DoM" jobs={DoM} />
      </li>
      <li>
        <JobsList title="DoH" jobs={DoH} />
      </li>
      <li>
        <JobsList title="DoL" jobs={DoL} />
      </li>
    </ul>
  );
}

export default JobMenu;
