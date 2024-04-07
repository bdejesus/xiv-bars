import { useAppState } from 'components/App/context';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

export function JobMenu() {
  const { jobs } = useAppState();

  if (!jobs) return null;

  const Tanks = jobs.filter((job) => job.Role === 'TANK');
  const Melee = jobs.filter((job) => job.Role === 'PDPS');
  const Ranged = jobs.filter((job) => job.Role === 'RDPS');
  const Mages = jobs.filter((job) => job.Role === 'MDPS');
  const Healers = jobs.filter((job) => job.Role === 'HEAL');

  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <>
      <ul className={styles.jobGroupList}>
        <li>
          <JobsList abbr="Tanks" title="Disciple of War" jobs={Tanks} />
        </li>
        <li>
          <JobsList abbr="Healers" title="Disciple of War" jobs={Healers} />
        </li>

        <li>
          <JobsList abbr="Melee" title="Disciple of War" jobs={Melee} />
        </li>
        <li>
          <JobsList abbr="Ranged" title="Disciple of Magic" jobs={Ranged} />
        </li>
        <li>
          <JobsList abbr="Mages" title="Disciple of War" jobs={Mages} />
        </li>
      </ul>

      <ul className={styles.jobGroupList}>
        <li className={styles.crafterJobs}>
          <JobsList abbr="DoH" title="Disciple of the Hand" jobs={DoH} />
        </li>
        <li className={styles.crafterJobs}>
          <JobsList abbr="DoL" title="Disciple of the Land" jobs={DoL} />
        </li>
      </ul>
    </>
  );
}

export default JobMenu;
