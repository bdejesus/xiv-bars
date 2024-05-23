import Image from 'next/image';

import styles from './Lore.module.scss';

interface Props {
  description: string,
  jobAbbr?: string
}

export default function Lore({ description, jobAbbr }: Props) {
  return (
    <div
      className={styles.lore}
    >
      { jobAbbr && ( <Image src={`/classjob/sprite-${jobAbbr}@2x.png`} alt={jobAbbr} height={50} width={50} /> )}

      <div
        className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
