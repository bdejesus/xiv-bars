import Link from 'next/link';
import Job from 'components/JobSelect/Job';
import Icon from 'components/Icon';
import type { LayoutProps } from 'types/Layout';
import type { ClassJobProps } from 'types/ClassJob';
import styles from './Tags.module.scss';

interface Props {
  layoutView: LayoutProps,
  job: ClassJobProps
}

export default function Tags({ layoutView, job }:Props) {
  return (
    <div className={styles.tags}>
      { job && (
        <Link href={`/job/${job.Abbr}`}>
          <Job job={job} className={styles.tag} name={false} />
        </Link>
      )}

      <span className={styles.tag}>
        <Icon id={layoutView.isPvp ? 'pvp' : 'pve'} alt={`${layoutView.isPvp ? 'PvP' : 'PvE'} Icon`} />
        { layoutView.isPvp ? 'PvP' : 'PvE' }
      </span>

      { (layoutView.layout === 0) && (
        <span className={styles.tag}>
          <Icon id="xhb" alt="Cross Hotbar Icon" />
          XHB
        </span>
      )}

      { (layoutView.layout === 1) && (
        <span className={styles.tag}>
          <Icon id="hb" alt="Hotbar Icon" />
          HB
        </span>
      )}
    </div>
  );
}
