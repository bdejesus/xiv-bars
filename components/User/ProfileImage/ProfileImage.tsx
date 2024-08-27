import React from 'react';
import Link from 'next/link';

import styles from './ProfileImage.module.scss';

interface ImageProps {
  src?: string,
  alt: string
}

function Image({ src = undefined, alt }:ImageProps) {
  return src
    ? (
      <img
        src={src}
        alt={alt}
        itemProp="image"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    )
    : <img src="/icons/favicon-96x96.png" className={styles.placeholder} alt={alt} />;
}

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
  className = '',
}:ProfileImageProps) {
  return (
    href ? (
      <Link
        href={href}
        className={[styles.wrapper, className].join(' ')}
        tabIndex={-1}
      >
        <Image src={src} alt={title} />
      </Link>
    ) : (
      <div className={[styles.wrapper, className].join(' ')}>
        <Image src={src} alt={title} />
      </div>
    )
  );
}
