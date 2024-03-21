import { useAppDispatch } from 'components/App/context';
import { AppActions } from 'components/App/actions';
import Icon from 'components/Icon';
import styles from './Hearts.module.scss';

interface HeartsProps {
  layoutId: number,
  count: number,
  hearted?: boolean,
  disabled?: boolean,
  className?: string
}

export default function Hearts({
  layoutId,
  count,
  hearted,
  disabled,
  className
}:HeartsProps) {
  const appDispatch = useAppDispatch();

  function handleHeart() {
    if (!disabled) {
      const options = {
        method: 'POST',
        body: JSON.stringify({ layoutId, method: hearted ? 'unheart' : 'heart', heartId: hearted.id }),
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
              payload: { heartsCount: json.count, hearted: json.hearted }
            });
          }
        });
    }
  }

  return (
    <button
      type="button"
      className={`button btn-sm ${styles.heartBtn} ${className}`}
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
