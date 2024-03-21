import { useAppDispatch } from 'components/App/context';
import { AppActions } from 'components/App/actions';
import Icon from 'components/Icon';
import type { Heart } from 'types/Heart';
import styles from './Hearts.module.scss';

interface Props {
  layoutId: number,
  count: number,
  hearted?: Heart,
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

  function handleHeart() {
    if (!disabled) {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          layoutId,
          heartId: hearted?.id,
          method: hearted ? 'unheart' : 'heart',
        }),
        headers: { 'Content-Type': 'application/json' }
      };

      fetch('/api/layout', options)
        .then((data) => data.json())
        .then((json) => {
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
      data-title={hearted ? 'Un-heart this layout' : 'Heart this layout'}
      onClick={handleHeart}
      data-disabled={disabled}
      data-hearted={hearted?.id}
    >
      <Icon id={hearted ? 'hearted' : 'heart'} alt="Heart" />
      <span className={styles.count}>{count || 0}</span>
    </button>
  );
}

Hearts.defaultProps = {
  disabled: true,
  hearted: false,
  className: ''
};
