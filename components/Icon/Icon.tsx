import Image from 'next/image';
import styles from './Icon.module.scss';

interface Props {
  id: string,
  alt: string,
  className?: string,
  type?: 'black' | 'white' | 'active' | undefined
}

export default function Icon({
  id,
  alt,
  className = '',
  type = 'black'
}:Props) {
  return (
    <span className={`${styles.icon} ${className} ${type && styles[type]} icon`}>
      <Image
        src={`/images/icon-${id}.svg`}
        alt={alt || ''}
        className={`${styles.iconImage} icon-image`}
        width={16}
        height={16}
      />
    </span>
  );
}
