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
  const classSelectors = () => {
    const selectors = [styles.icon, className, 'icon'];
    if (type) selectors.push(styles[type]);
    return selectors.join(' ');
  };

  return (
    <span className={classSelectors()}>
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
