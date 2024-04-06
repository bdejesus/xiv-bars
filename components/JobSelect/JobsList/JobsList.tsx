import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { localizePath } from 'lib/utils/i18n';
import Link from 'next/link';
import Icon, { Icons } from 'components/Icon';
import Job from '../Job';

import styles from './JobsList.module.scss';

interface Props {
  abbr: string,
  title: string,
  jobs: ClassJobProps[]
}

export function JobsList({ abbr, title, jobs }: Props) {
  const { locale } = useRouter();

  return (
    <div className={styles.group}>
      <h3 className={styles.title}><abbr title={title}>{abbr}</abbr></h3>

      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li key={job.Name} value={job.ID}>
            <Link href={`/job/${job.Abbr}`} className={styles.jobLink} draggable={false}>
              <Job job={job} />
            </Link>

            <a
              href={`${localizePath(`/job/${job.Abbr}`, locale)}/new`}
              className={`button btn-icon ${styles.addBtn}`}
              data-title={`New ${job.Name} Layout`}
              data-title-anchor="left-left"
            >
              <Icon
                id={Icons.ADD}
                className={styles.addIcon}
                type="white"
                alt="New Layout Icon"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsList;
