import { useAppDispatch } from 'components/App/context';
import { AppActions } from 'components/App/actions';
import Icon from 'components/Icon';
import { createHeart, destroyHeart } from 'lib/api/hearts';
import type { HeartProps } from 'types/Heart';
import I18n from 'lib/I18n/locale/en-US';
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
  const appDispatch = useAppDispatch();

  function handleHeartClick() {
    if (!disabled) {
      const heartAction = hearted
        ? destroyHeart(layoutId, hearted.id)
        : createHeart(layoutId);

      heartAction.then((json) => {
        if (json.error) {
          console.error(json.error);
        } else {
          appDispatch({
            type: AppActions.UPDATE_VIEW,
            payload: { _count: { hearts: json.count }, hearted: json.hearted }
          });
        }
      });
    }
  }

  return (
    <button
      type="button"
      className={`button ${styles.heartBtn} ${className}`}
      data-title={hearted ? I18n.Hearts.unheartTitle : I18n.Hearts.heartTitle}
      onClick={handleHeartClick}
      data-disabled={disabled}
      data-hearted={hearted?.id}
      data-title-anchor="left"
      disabled={disabled}
    >
      <Icon id={hearted ? 'hearted' : 'heart'} alt={I18n.Hearts.heart} />
      <span className={styles.count}>{count || 0}</span>
    </button>
  );
}

Hearts.defaultProps = {
  disabled: true,
  hearted: false,
  className: ''
};
