import styles from './Icon.module.scss';

interface Props {
  id: string,
  title?: string
}

export default function Icon({ id, title }: Props) {
  return (
    <span className={`${styles.iconWrapper} icon-wrapper`}>
      <img
        src={`/images/icon-${id}.svg`}
        alt={title || ''}
        className={`${styles.iconImage} icon-image`}
      />
    </span>
  );
}

Icon.defaultProps = {
  title: undefined
};
