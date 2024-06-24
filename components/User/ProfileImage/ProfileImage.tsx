import React from 'react';

import styles from './ProfileImage.module.scss';

interface ProfileImageProps {
  src: string,
  title: string,
  className?: string
}

export default function ProfileImage({ src, title, className }:ProfileImageProps) {
  return (
    <div className={[styles.wrapper, className].join(' ')}>
      <img src={src} alt={title} />
    </div>
  );
}

ProfileImage.defaultProps = {
  className: undefined
};
