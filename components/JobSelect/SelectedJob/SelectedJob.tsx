import React from 'react';
import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { translateData } from 'lib/utils/i18n';
import RoleNames from '../../../data/RoleNames.json';
import styles from './SelectedJob.module.scss';

interface Props {
  job: ClassJobProps,
  className?: string
}

interface RoleNamesType {
  [key: string]: string
}

export default function SelectedJob({ job, className }: Props) {
  const { locale } = useRouter();
  const displayAbbr = translateData('Abbreviation', job, locale);
  const displayName = translateData('Name', job, locale);
  const roleNames: RoleNamesType = RoleNames;

  return (
    <div className={[styles.container, className].join(' ')}>
      <div className={styles.iconWrapper}>
        <img
          src={`/jobIcons${job.Icon}`}
          alt=""
          height={36}
          width={36}
        />
      </div>
      <div className={styles.textWrapper}>
        <h1 className={styles.title}>
          <abbr className={styles.abbr}>{displayAbbr}</abbr>
          <span className={styles.name}>{displayName}</span>
        </h1>
        <div className={styles.role}>
          {job.Discipline} {job.Role && (`• ${roleNames[job.Role]}`)}
        </div>
      </div>
    </div>
  );
}

SelectedJob.defaultProps = {
  className: ''
};
