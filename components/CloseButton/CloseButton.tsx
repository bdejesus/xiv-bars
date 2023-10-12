import React from 'react';
import I18n from 'lib/I18n/locale/en-US';
import styles from './CloseButton.module.scss';

interface Props {
  onClick: React.MouseEventHandler,
  className?: string
}

export default function CloseButton({ onClick, className }: Props) {
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

CloseButton.defaultProps = {
  className: ''
};
