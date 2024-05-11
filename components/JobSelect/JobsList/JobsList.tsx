import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { useTranslation } from 'next-i18next';
import { translateData, localizePath } from 'lib/utils/i18n.mjs';
import Link from 'next/link';
import { useSystemDispatch } from 'components/System/context';
import { SystemActions } from 'components/System/actions';
import Icon, { Icons } from 'components/Icon';
import Job from '../Job';

import styles from './JobsList.module.scss';

interface Props {
  abbr: string,
  title: string,
  jobs: ClassJobProps[],
  className?: string
}

export function JobsList({
  abbr, title, jobs, className
}: Props) {
  const systemDispatch = useSystemDispatch();
  const { t } = useTranslation();
  const { locale } = useRouter();

  function handleClickNew() {
    systemDispatch({ type: SystemActions.LOADING_START });
  }

  return (
    <div className={`${styles.group} ${className}`}>
      <h4 className={styles.title}><abbr title={title}>{abbr}</abbr></h4>

      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li key={job.Name} value={job.ID}>
            <Link href={`/job/${job.Abbr}`} className={styles.jobLink} draggable={false}>
              <Job job={job} />
            </Link>

            <a
              href={localizePath(`/job/${job.Abbr}/new`, locale)}
              className={`button btn-icon ${styles.addBtn}`}
              data-title={t('JobsList.new_job_layout', { jobName: translateData('Name', job, locale) })}
              data-title-anchor="left-left"
              onClick={handleClickNew}
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

JobsList.defaultProps = {
  className: ''
};

export default JobsList;
