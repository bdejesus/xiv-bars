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
  title, src, href, className
}:ProfileImageProps) {
  const imageSrc = src || '/images/mog_trumpet.png';

  return (
    href ? (
      <Link href={href} className={[styles.wrapper, className].join(' ')}>
        <img src={imageSrc} alt={title} itemProp="image" />
      </Link>
    ) : (
      <div className={[styles.wrapper, className].join(' ')}>
        <img src={imageSrc} alt={title} itemProp="image" />
      </div>
    )
  );
}

ProfileImage.defaultProps = {
  className: undefined,
  src: undefined,
  href: undefined
};
