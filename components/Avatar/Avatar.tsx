import styles from './Avatar.module.scss';

interface AvatarProps {
  img: string,
  className?: string,
}

export default function Avatar({
  img,
  className = ''
}:AvatarProps) {
  const avatarStyles = {
    backgroundImage: `url('/avatars/${img}')`
  };

  return (
    <div
      className={[styles.wrapper, className].join(' ')}
      style={avatarStyles}
    />
  );
}
