import styles from './Icon.module.scss';

interface Props {
  id: string,
  alt: string,
  className?: string,
  type?: 'white' | 'active' | undefined
}

export default function Icon({
  id,
  alt,
  className,
  type
}:Props) {
  return (
    <span className={`${styles.icon} ${className} ${type && styles[type]} icon`}>
      <img
        src={`/images/icon-${id}.svg`}
        alt={alt || ''}
        className={`${styles.iconImage} icon-image`}
      />
    </span>
  );
}

Icon.defaultProps = {
  className: '',
  type: 'black'
};
