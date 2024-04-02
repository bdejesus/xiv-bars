import styles from './Tooltip.module.scss';

interface Props {
  content: string
}

export default function Description({ content }: Props) {
  const cleanDesc = () => {
    const trim = content;
    const str = trim.replace(/(?:\r\n|\r|\n)/g, '<div>');
    return str;
  };
  const descHtml = { __html: cleanDesc() };

  return (
    <div
      className={styles.description}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={descHtml}
    />
  );
}
