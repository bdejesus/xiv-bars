import React from 'react';
import ClassJob from 'components/ClassJob';
import type { ClassJobProps } from 'types/ClassJob';
import RoleNames from '../../../data/RoleNames.json';
import styles from './SelectedJob.module.scss';

interface Props {
  job: ClassJobProps,
  className?: string
}

interface RoleNamesType {
  [key: string]: string
}

export default function SelectedJob({ job, className = '' }: Props) {
  const roleNames: RoleNamesType = RoleNames;

  return (
    <div className={[styles.container, className].join(' ')}>
      <div className={styles.role}>
        {job.Discipline} {(job.Role && roleNames[job.Role]) && (`• ${roleNames[job.Role]}`)}
      </div>
      <h1 className={styles.title}>
        <ClassJob job={job} />
      </h1>
    </div>
  );
}
