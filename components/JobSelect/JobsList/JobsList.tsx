import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { useTranslation } from 'next-i18next';
import { translateData, localizePath } from 'lib/utils/i18n.mjs';
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
  title,
  jobs,
  className = '',
  action
}: Props) {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const classNames = [styles.container, className].join(' ');

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
            itemScope
            itemProp="itemListElement"
            itemType="https://schema.org/ListItem"
          >
            <a
              href={action === 'new'
                ? localizePath(`/job/${job.Abbr}/new`, locale)
                : localizePath(`/job/${job.Abbr}`, locale)}
              className={`${styles.jobLink} jobList-link`}
              draggable={false}
              itemProp="url"
              aria-labelledby={`job-label-${job.Name}`}
            >
              <ClassJob job={job} className={styles.classJob} />
            </a>

            <a
              href={localizePath(`/job/${job.Abbr}/new`, locale)}
              className={`button btn-icon ${styles.addBtn} joblist-new`}
            >
              <Icon
                id={Icons.ADD}
                className={styles.addIcon}
                type="white"
                alt="New Layout Icon"
              />
              <span className={`${styles.addLabel} btn-label`}>
                {t('JobsList.new_job_layout', { jobName: translateData('Name', job, locale) })}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsList;
