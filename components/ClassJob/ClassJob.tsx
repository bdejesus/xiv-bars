import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import type { ClassJobProps } from 'types/ClassJob';
import { translateData } from 'lib/utils/i18n.mjs';
import styles from './ClassJob.module.scss';

interface Props {
  job: ClassJobProps,
  className?: string,
  abbr?: boolean,
  name?: boolean,
  icon?: boolean
}

export default function ClassJob({
  job,
  className = '',
  abbr = true,
  name = true,
  icon = true
}: Props) {
  const { locale } = useRouter();
  const displayAbbr = translateData('Abbreviation', job, locale);
  const displayName = translateData('Name', job, locale);

  return (
    <span
      className={[styles.container, className].join(' ')}
      id={`job-label-${job.Name}`}
    >
      <span className={`${styles.jobWrapper} job-wrapper`} data-role={job.Role}>
        { icon && (
          <span className={`${styles.iconWrapper} job-icon`}>
            <Image
              className={styles.icon}
              src={`/jobIcons/${job.Name.replaceAll(' ', '')}.png`}
              alt={`${job.Name} Icon`}
              draggable={false}
              height={32}
              width={32}
              itemProp="image"
              data-src={`/jobIcons/${job.Name.replaceAll(' ', '')}.png`}
            />
          </span>
        )}

        { abbr && (
          <b className={`${styles.abbr} job-abbr`}>{displayAbbr}</b>
        )}
      </span>

      { name && (
        <span className={`${styles.name} job-name`} itemProp="name">
          {displayName}
        </span>
      )}
    </span>
  );
}
