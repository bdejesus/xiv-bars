import styles from './Lore.module.scss';

interface Props {
  description: string
}

export default function Lore({ description }: Props) {
  return (
    <blockquote
      className={styles.lore}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}
