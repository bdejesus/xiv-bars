import React from 'react';
import { useRouter } from 'next/router';
import type { ClassJobProps } from 'types/ClassJob';
import { localizeKey } from 'lib/utils/i18n';
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
  const displayAbbr = job[localizeKey('Abbreviation', locale) as keyof typeof job];
  const displayName = job[localizeKey('Name', locale) as keyof typeof job];
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
