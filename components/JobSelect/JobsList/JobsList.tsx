import I18n from 'lib/I18n/locale/en-US';
import type { ClassJobProps } from 'types/ClassJob';
import Link from 'next/link';
import Icon from 'components/Icon';
import Job from '../Job';

import styles from './JobsList.module.scss';

interface Props {
  title: string,
  jobs: ClassJobProps[]
}

export function JobsList({ title, jobs }: Props) {
  return (
    <div className={styles.group}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li key={job.Name} value={job.ID}>
            <Link href={`/job/${job.Abbr}`} draggable={false}>
              <Job job={job} />
            </Link>

            <Link href={`/job/${job.Abbr}/new`} className={styles.addBtn} title={I18n.JobsList.new_layout}>
              <Icon
                id="add"
                className={styles.addIcon}
                type="white"
                alt="New Layout Icon"
              />
              <span className={`${styles.addLabel} btn-label`}>New</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsList;
