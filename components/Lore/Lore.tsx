import styles from './Lore.module.scss';

interface Props {
  description: string
}

export default function Lore({ description }: Props) {
  return (
    <blockquote
      className={styles.lore}
       
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}
