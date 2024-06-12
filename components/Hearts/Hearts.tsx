import { useTranslation } from 'next-i18next';
import { useAppDispatch } from 'components/App/context';
import { appActions } from 'components/App/actions';
import Icon from 'components/Icon';
import { createHeart, breakHeart } from 'lib/api/hearts';
import analytics from 'lib/analytics';
import type { HeartProps } from 'types/Heart';
import styles from './Hearts.module.scss';

interface Props {
  layoutId: number,
  count: number,
  hearted?: HeartProps,
  disabled?: boolean,
  className?: string
}

export default function Hearts({
  layoutId,
  count,
  hearted,
  disabled,
  className
}:Props) {
  const { t } = useTranslation();
  const appDispatch = useAppDispatch();

  function handleHeartClick() {
    if (!disabled) {
      const heartAction = hearted
        ? breakHeart(layoutId, hearted.id)
        : createHeart(layoutId);

      heartAction.then((json) => {
        if (json.error) {
          console.error(json.error);
        } else {
          appDispatch({
            type: appActions.UPDATE_VIEW,
            payload: { _count: { hearts: json.count }, hearted: json.hearted }
          });
        }

        if (!hearted) {
          analytics.event({ action: 'click', params: { id: 'heart' } });
        }
      });
    }
  }

  return (
    <button
      type="button"
      className={`button ${styles.heartBtn} ${className}`}
      data-title={hearted ? t('Hearts.unheartTitle') : t('Hearts.heartTitle')}
      onClick={handleHeartClick}
      data-disabled={disabled}
      data-hearted={hearted?.id}
      data-title-anchor="left"
      disabled={disabled}
    >
      <Icon id={hearted ? 'hearted' : 'heart'} alt={t('Hearts.heart')} />
      { count > 0 && <span className={styles.count}>{count}</span> }
    </button>
  );
}

Hearts.defaultProps = {
  disabled: true,
  hearted: false,
  className: ''
};
