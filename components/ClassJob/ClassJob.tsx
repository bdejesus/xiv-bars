import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import type { ClassJobProps } from 'types/ClassJob';
import { translateData } from 'lib/utils/i18n.mjs';
import styles from './ClassJob.module.scss';

interface Props {
  job: ClassJobProps,
  className?: string,
  abbr?: boolean,
  name?: boolean,
  icon?: boolean,
  href?: string
}

interface ClassJobElementsProps {
  icon: boolean,
  job: ClassJobProps,
  name: boolean,
  abbr: boolean,
}

function ClassJobElements({
  icon, job, name, abbr
}:ClassJobElementsProps) {
  const { locale } = useRouter();
  const displayAbbr = translateData('Abbreviation', job, locale);
  const displayName = translateData('Name', job, locale);

  return (
    <>
      <span className={`${styles.jobWrapper} job-wrapper`}>
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
    </>
  );
}

export default function ClassJob({
  job,
  className = '',
  abbr = true,
  name = true,
  icon = true,
  href = undefined
}: Props) {
  if (href) {
    return (
      <Link
        href={href}
        className={[styles.container, className].join(' ')}
        id={`job-label-${job.Name}`}
        data-role={job.Role}
      >
        <ClassJobElements icon={icon} job={job} name={name} abbr={abbr} />
      </Link>
    );
  }
  return (
    <span
      className={[styles.container, className].join(' ')}
      id={`job-label-${job.Name}`}
      data-role={job.Role}
    >
      <ClassJobElements icon={icon} job={job} name={name} abbr={abbr} />
    </span>
  );
}
