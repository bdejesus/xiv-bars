import React from 'react';
import I18n from 'lib/I18n/locale/en-US';
import styles from './CloseButton.module.scss';

interface Props {
  onClick: React.MouseEventHandler,
  className?: string
}

export function CloseButton({ onClick, className }: Props) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      {I18n.Global.close}
    </button>
  );
}

export default CloseButton;
