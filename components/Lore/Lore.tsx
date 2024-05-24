import styles from './Lore.module.scss';

interface Props {
  description: string
}

export default function Lore({ description }: Props) {
  return (
    <div
      className={styles.lore}
    >

      <div
        className={styles.loreBody}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
