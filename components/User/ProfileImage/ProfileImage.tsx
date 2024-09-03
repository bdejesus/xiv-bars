import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './ProfileImage.module.scss';

interface ProfileImageProps {
  title: string,
  src: string,
  className?: string,
  href?: string,
  size?: number
}

export default function ProfileImage({
  title,
  src,
  href,
  className = '',
  size = 42
}:ProfileImageProps) {
  const imgSrc = src || '/icons/favicon-96x96.png';

  return (
    href ? (
      <Link
        href={href}
        className={[styles.wrapper, className].join(' ')}
        tabIndex={-1}
      >
        <Image src={imgSrc} alt={title} itemProp="image" height={size} width={size} />
      </Link>
    ) : (
      <div className={[styles.wrapper, className].join(' ')}>
        <Image src={imgSrc} alt={title} itemProp="image" height={size} width={size} />
      </div>
    )
  );
}
