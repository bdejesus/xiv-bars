import React, { ReactNode } from 'react';
import ClassJob from 'components/ClassJob';
import type { ClassJobProps } from 'types/ClassJob';
import RoleNames from '../../../data/RoleNames.json';
import styles from './SelectedJob.module.scss';

interface Props {
  job: ClassJobProps,
  className?: string,
  children?: ReactNode
}

interface RoleNamesType {
  [key: string]: string
}

export default function SelectedJob({ job, className = '', children = undefined }: Props) {
  const roleNames: RoleNamesType = RoleNames;

  return (
    <div className={[styles.container, className].join(' ')}>
      <div className={styles.role}>
        {job.Discipline} {(job.Role && roleNames[job.Role]) && (`• ${roleNames[job.Role]}`)}
      </div>
      <div className={styles.title} data-role={job.Role}>
        <h2><ClassJob job={job} /></h2>
        { children }
        <div className={styles.titleBg} />
      </div>
    </div>
  );
}
