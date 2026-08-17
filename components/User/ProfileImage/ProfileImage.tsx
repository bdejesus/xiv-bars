import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { avatarUrl, DEFAULT_AVATAR_SRC } from 'lib/avatar';

import styles from './ProfileImage.module.scss';

interface ProfileImageProps {
  title: string,
  // Preferred: resolves to our own non-expiring avatar path. Pass `src` only for
  // images that do not belong to a user account.
  userId?: number,
  src?: string,
  className?: string,
  href?: string,
  size?: number
}

export default function ProfileImage({
  title,
  userId,
  src,
  href,
  className = '',
  size = 42
}:ProfileImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = userId ? avatarUrl(userId) : src;
  // Covers a src that resolves but fails to load. The previous version only
  // substituted the placeholder for an empty src, so a dead URL rendered as a
  // broken image.
  const imgSrc = (!failed && resolvedSrc) || DEFAULT_AVATAR_SRC;

  const image = (
    <Image
      src={imgSrc}
      alt={title}
      itemProp="image"
      height={size}
      width={size}
      onError={() => setFailed(true)}
    />
  );

  return (
    href ? (
      <Link
        href={href}
        className={[styles.wrapper, className].join(' ')}
        tabIndex={-1}
      >
        {image}
      </Link>
    ) : (
      <div className={[styles.wrapper, className].join(' ')}>
        {image}
      </div>
    )
  );
}
