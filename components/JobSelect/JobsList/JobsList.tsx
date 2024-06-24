import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { useTranslation } from 'next-i18next';
import { translateData, localizePath } from 'lib/utils/i18n.mjs';
import Link from 'next/link';
import { useSystemDispatch } from 'components/System/context';
import { systemActions } from 'components/System/actions';
import Icon, { Icons } from 'components/Icon';
import ClassJob from 'components/ClassJob';

import styles from './JobsList.module.scss';

interface Props {
  title: string,
  jobs: ClassJobProps[],
  className?: string,
  action?: 'new'
}

export function JobsList({
  title, jobs, className, action
}: Props) {
  const systemDispatch = useSystemDispatch();
  const { t } = useTranslation();
  const { locale } = useRouter();
  const classNames = [styles.container, className].join(' ');

  function handleClickNew() {
    systemDispatch({ type: systemActions.LOADING_START });
  }

  return (
    <div
      className={classNames}
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <h4 className={styles.title} itemProp="name">{title}</h4>

      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li
            key={job.Name}
            value={job.ID}
            data-disabled={job.Disabled}
            itemScope
            itemProp="itemListElement"
            itemType="https://schema.org/ListItem"
          >
            { job.Disabled ? (
              <ClassJob job={job} />
            ) : (
              <>
                <Link
                  href={action === 'new' ? `/job/${job.Abbr}/new` : `/job/${job.Abbr}`}
                  className={`${styles.jobLink} jobList-link`}
                  draggable={false}
                  itemProp="url"
                >
                  <ClassJob job={job} />
                </Link>

                <a
                  href={localizePath(`/job/${job.Abbr}/new`, locale)}
                  className={`button btn-icon ${styles.addBtn} joblist-new`}
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
  className: '',
  action: undefined
};

export default JobsList;
