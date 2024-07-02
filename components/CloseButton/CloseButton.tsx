import React from 'react';
import { useTranslation } from 'next-i18next';
import Icon, { Icons } from 'components/Icon';
import styles from './CloseButton.module.scss';

interface Props {
  onClick: React.MouseEventHandler,
  className?: string
}

export default function CloseButton({ onClick, className }: Props) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={`${styles.button} ${className} button btn-alt btn-icon`}
      onClick={onClick}
    >
      <Icon id={Icons.REMOVE} alt={t('Global.close')} type="white" />
      <span className='btn-label-hidden'>{t('Global.close')}</span>
    </button>
  );
}

CloseButton.defaultProps = {
  className: ''
};
