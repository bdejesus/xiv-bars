import styles from './Icon.module.scss';

interface Props {
  id: string,
  title: string,
  className?: string,
  type?: 'white' | 'active' | undefined
}

export default function Icon({
  id,
  title,
  className,
  type
}:Props) {
  return (
    <span className={`${styles.icon} ${className} ${type && styles[type]} icon`}>
      <img
        src={`/images/icon-${id}.svg`}
        alt={title || ''}
        className={`${styles.iconImage} icon-image`}
      />
    </span>
  );
}

Icon.defaultProps = {
  className: '',
  type: 'black'
};
