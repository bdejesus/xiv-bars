import React from 'react';
import Image from 'next/image';
import type { ClassJobProps } from 'types/ClassJob';
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
  return (
    <div className={[styles.wrapper, className].join(' ')}>
      { icon && (
        <Image
          className={`${styles.icon} job-icon`}
          src={job.PreIcon || `/jobIcons${job.Icon}`}
          alt={`${job.Name} Icon`}
          draggable={false}
          height={32}
          width={32}
        />
      )}

      { abbr && (
        <b className={`${styles.abbr} job-abbr`}>{job.Abbr}</b>
      )}

      { name && (
        <>
          &nbsp;
          <span className={`${styles.name} job-name`}>{job.Name}</span>
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
