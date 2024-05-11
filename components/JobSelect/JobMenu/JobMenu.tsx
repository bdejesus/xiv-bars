import { useAppState } from 'components/App/context';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

export function JobMenu() {
  const { jobs } = useAppState();

  if (!jobs) return null;

  const tanks = jobs.filter((job) => job.Role === 'TANK');
  const healers = jobs.filter((job) => job.Role === 'HEAL');
  const mages = jobs.filter((job) => job.Role?.match(/MDPS/));
  const melee = jobs.filter((job) => ['PDPS', 'RDPS'].includes(job.Role || ''));

  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>DoW/DoM</h3>

        <div className={styles.categories}>
          <JobsList abbr="Tank" title="Disciple of War" jobs={tanks} className={styles.jobList} />
          <JobsList abbr="Healer" title="Disciple of Magic" jobs={healers} className={styles.jobList} />
          <JobsList abbr="Melee DPS" title="Disciple of Magic" jobs={melee} className={styles.jobList} />
          <JobsList abbr="Magic DPS" title="Disciple of Magic" jobs={mages} className={styles.jobList} />
        </div>
      </div>

      <div className={styles.section}>
        <h3>DoH/DoL</h3>
        <div className={styles.categories}>
          <JobsList abbr="DoH" title="Disciple of the Hand" jobs={DoH} className={styles.jobList} />
          <JobsList abbr="DoL" title="Disciple of the Land" jobs={DoL} className={styles.jobList} />
        </div>
      </div>
    </div>
  );
}

export default JobMenu;
