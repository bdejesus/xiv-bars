import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { ClassJobProps } from 'types/ClassJob';
import { translateData } from 'lib/utils/i18n.mjs';
import styles from './Job.module.scss';

interface Props {
  job: ClassJobProps,
  className?: string,
  abbr?: boolean,
  name?: boolean,
  icon?: boolean
}

export default function Job({
  job,
  className,
  abbr,
  name,
  icon
}: Props) {
  const { locale } = useRouter();
  const displayAbbr = translateData('Abbreviation', job, locale);
  const displayName = translateData('Name', job, locale);

  return (
    <div className={[styles.container, className].join(' ')} data-disabled={job.Disabled}>
      <span className={`${styles.jobWrapper} job-wrapper`} data-role={job.Role}>
        { icon && (
          <span className={`${styles.iconWrapper} job-icon`}>
            <Image
              className={styles.icon}
              src={job.PreIcon || `/jobIcons${job.Icon}`}
              alt={`${job.Name} Icon`}
              draggable={false}
              height={32}
              width={32}
            />
          </span>
        )}

        { abbr && (
          <b className={`${styles.abbr} job-abbr`}>{displayAbbr}</b>
        )}
      </span>

      { name && (
        <>
          &nbsp;
          <span className={`${styles.name} job-name`}>{displayName}</span>
        </>
      )}
    </div>
  );
}

Job.defaultProps = {
  className: '',
  abbr: true,
  name: true,
  icon: true
};
