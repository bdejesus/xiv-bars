import React from 'react';
import Icon from 'components/Icon';
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
      className={`${styles.button} ${className} button btn-alt`}
      onClick={onClick}
    >
      <Icon id="remove" alt={I18n.Global.close} type="white" />
      {I18n.Global.close}
    </button>
  );
}

CloseButton.defaultProps = {
  className: ''
};
