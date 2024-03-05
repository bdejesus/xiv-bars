import I18n from 'lib/I18n/locale/en-US';
import type { ClassJobProps } from 'types/ClassJob';
import styles from './Lore.module.scss';

interface Props {
  selectedJob: ClassJobProps
}

export default function Lore({ selectedJob }: Props) {
  if (!selectedJob.Description) return null;

  return (
    <div
      className={styles.lore}
    >
      <div
        className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: selectedJob.Description }}
      />
    </div>
  );
}
