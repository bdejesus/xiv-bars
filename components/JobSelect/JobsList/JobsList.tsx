import I18n from 'lib/I18n/locale/en-US';
import { ClassJob } from 'types/ClassJob';
import Job from '../Job';

import styles from './JobsList.module.scss';

type Props = {
  title: string,
  jobs: ClassJob[]
}

export function JobsList({ title, jobs }: Props) {
  return (
    <div className={styles.group}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li key={job.Name} value={job.ID}>
            <a href={`/job/${job.Abbr}`} draggable={false}>
              <Job job={job} />
            </a>

            <a href={`/job/${job.Abbr}/new`} className={styles.addBtn} title={I18n.JobsList.new_layout}>
              <span className={styles.addIcon}>+</span>
              <span className={styles.addLabel}>New</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsList;
