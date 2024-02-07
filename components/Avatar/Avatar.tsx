import Image from 'next/image';
import styles from './Avatar.module.scss';

interface AvatarProps {
  img: string,
  alt: string,
  className?: string,
  height?: number
  width?: number
}

export default function Avatar({
  img,
  alt,
  className,
  height,
  width
}:AvatarProps) {
  const avatarStyles = {
    backgroundImage: `url('/avatars/${img}')`
  }

  return (
    <div
      className={[styles.wrapper, className].join(' ')}
      style={avatarStyles}
    />
  );
}

Avatar.defaultProps = {
  className: '',
  height: undefined,
  width: undefined
}
