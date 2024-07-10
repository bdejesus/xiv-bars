import { ReactNode } from 'react';
import Link from 'next/link';
import ClassJob from 'components/ClassJob';
import Icon from 'components/Icon';
import type { LayoutViewProps } from 'types/Layout';
import type { ClassJobProps } from 'types/ClassJob';
import styles from './Tags.module.scss';

interface Props {
  className?: string,
  layoutView: LayoutViewProps,
  job: ClassJobProps,
  children?: ReactNode
}

export default function Tags({
  className = undefined,
  layoutView,
  job,
  children
}:Props) {
  return (
    <div className={[styles.tags, className].join(' ')}>
      { job && (
        <Link href={`/job/${job.Abbr}`} className={`${styles.jobTag} tag`} data-role={job.Role}>
          <ClassJob job={job} className={styles.tag} name={false} />
        </Link>
      )}

      { (layoutView.layout === 0) && (
        <div className={`${styles.tag} tag`}>
          <Icon id="xhb" alt="Cross Hotbar Icon" />
          <span className={`${styles.name} tag-name`}>XHB</span>
        </div>
      )}

      { (layoutView.layout === 1) && (
        <div className={`${styles.tag} tag`}>
          <Icon id="hb" alt="Hotbar Icon" />
          <span className={`${styles.name} tag-name`}>HB</span>
        </div>
      )}

      <div className={`${styles.tag} tag`}>
        <Icon id={layoutView.isPvp ? 'pvp' : 'pve'} alt={`${layoutView.isPvp ? 'P.V.P.' : 'P.V.E.'} Icon`} />
        <span className={`${styles.name} tag-name`}>{ layoutView.isPvp ? 'PVP' : 'PVE' }</span>
      </div>

      { children }
    </div>
  );
}
