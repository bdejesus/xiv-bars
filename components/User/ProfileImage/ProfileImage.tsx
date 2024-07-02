import React from 'react';
import Link from 'next/link';

import styles from './ProfileImage.module.scss';

interface ProfileImageProps {
  title: string,
  src?: string,
  className?: string,
  href?: string
}

export default function ProfileImage({
  title,
  src,
  href,
  className = ''
}:ProfileImageProps) {
  const Image = () => src
    ? <img src={src} alt={title} itemProp="image" />
    : <img src={'/icons/favicon-96x96.png'} className={styles.placeholder} alt={title} />;

  return (
    href ? (
      <Link href={href} className={[styles.wrapper, className].join(' ')}>
        <Image />
      </Link>
    ) : (
      <div className={[styles.wrapper, className].join(' ')}>
        <Image />
      </div>
    )
  );
}
