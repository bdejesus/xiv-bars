import Job from 'components/JobSelect/Job';
import type { ViewDataProps } from 'types/View';
import type { ClassJobProps } from 'types/ClassJob';
import styles from './Tags.module.scss';

interface Props {
  layoutView: ViewDataProps,
  job: ClassJobProps
}

export default function Tags({ layoutView, job }:Props) {
  return (
    <div className={styles.tags}>
      { job && <Job job={job} className={styles.tag} name={false} /> }
      <span className={styles.tag}>{ layoutView.isPvp ? 'PvP' : 'PvE' }</span>
      { (layoutView.layout === 0) && <span className={styles.tag}>XHB</span> }
      { (layoutView.layout === 1) && <span className={styles.tag}>HB</span> }
    </div>
  );
}
