import styles from './Icon.module.scss';

interface Props {
  id: string,
  title?: string,
  className?: string
}

export default function Icon({ id, title, className }: Props) {
  return (
    <span className={`${styles.iconWrapper} ${className} icon-wrapper`}>
      <img
        src={`/images/icon-${id}.svg`}
        alt={title || ''}
        className={`${styles.iconImage} icon-image`}
      />
    </span>
  );
}

Icon.defaultProps = {
  title: undefined,
  className: ''
};
