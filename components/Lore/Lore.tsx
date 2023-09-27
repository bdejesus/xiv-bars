import I18n from 'lib/I18n/locale/en-US';
import { ClassJob } from 'types/ClassJob';
import styles from './Lore.module.scss';

interface Props {
  selectedJob: ClassJob
}

export function Lore({ selectedJob }: Props) {
  return (
    <div
      className={styles.lore}
    >
      <h3 className={styles.loreTitle}>
        {I18n.Lore.lore}
      </h3>
      <div
        className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: selectedJob.Description }}
      />
    </div>
  );
}

export default Lore;
