import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { useTranslation } from 'next-i18next';
import { translateData, localizePath } from 'lib/utils/i18n.mjs';
import Link from 'next/link';
import { useSystemDispatch } from 'components/System/context';
import { SystemActions } from 'components/System/actions';
import Icon, { Icons } from 'components/Icon';
import ClassJob from 'components/ClassJob';

import styles from './JobsList.module.scss';

interface Props {
  title: string,
  jobs: ClassJobProps[],
  className?: string
}

export function JobsList({
  title, jobs, className
}: Props) {
  const systemDispatch = useSystemDispatch();
  const { t } = useTranslation();
  const { locale } = useRouter();

  function handleClickNew() {
    systemDispatch({ type: SystemActions.LOADING_START });
  }

  return (
    <div className={`${styles.group} ${className}`}>
      <h4 className={styles.title}>{title}</h4>

      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li key={job.Name} value={job.ID} data-disabled={job.Disabled}>
            { job.Disabled ? (
              <ClassJob job={job} />
            ) : (
              <>
                <Link href={`/job/${job.Abbr}`} className={styles.jobLink} draggable={false}>
                  <ClassJob job={job} />
                </Link>

                <a
                  href={localizePath(`/job/${job.Abbr}/new`, locale)}
                  className={`button btn-icon ${styles.addBtn}`}
                  onClick={handleClickNew}
                >
                  <Icon
                    id={Icons.ADD}
                    className={styles.addIcon}
                    type="white"
                    alt="New Layout Icon"
                  />
                  <span className={styles.addLabel}>
                    {t('JobsList.new_job_layout', { jobName: translateData('Name', job, locale) })}
                  </span>
                </a>
              </>
            )}
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
