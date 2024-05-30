import Link from 'next/link';
import ClassJob from 'components/ClassJob';
import Icon from 'components/Icon';
import type { LayoutViewProps } from 'types/Layout';
import type { ClassJobProps } from 'types/ClassJob';
import styles from './Tags.module.scss';

interface Props {
  layoutView: LayoutViewProps,
  job: ClassJobProps
}

export default function Tags({ layoutView, job }:Props) {
  return (
    <div className={styles.tags}>
      { job && (
        <Link href={`/job/${job.Abbr}`} className={`${styles.jobTag} tag`} data-role={job.Role}>
          <ClassJob job={job} className={styles.tag} name={false} />
        </Link>
      )}

      { (layoutView.layout === 0) && (
        <span className={`${styles.tag} tag`}>
          <Icon id="xhb" alt="Cross Hotbar Icon" />
          <span className={`${styles.name} tag-name`}>XHB</span>
        </span>
      )}

      { (layoutView.layout === 1) && (
        <span className={`${styles.tag} tag`}>
          <Icon id="hb" alt="Hotbar Icon" />
          <span className={`${styles.name} tag-name`}>HB</span>
        </span>
      )}

      <span className={`${styles.tag} tag`}>
        <Icon id={layoutView.isPvp ? 'pvp' : 'pve'} alt={`${layoutView.isPvp ? 'P.V.P.' : 'P.V.E.'} Icon`} />
        <span className={`${styles.name} tag-name`}>{ layoutView.isPvp ? 'PVP' : 'PVE' }</span>
      </span>
    </div>
  );
}
