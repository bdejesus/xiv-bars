import { appActions } from 'components/App/actions';
import { useAppState, useAppDispatch } from 'components/App/context';
import Icon, { Icons } from 'components/Icon';
import styles from './DetailPanel.module.scss';

export default function ToggleDetailPanel() {
  const appDispatch = useAppDispatch();
  const { showDetails } = useAppState();

  function handleClick() {
    appDispatch({ type: appActions.TOGGLE_DETAILS });
  }

  return (
    <button
      className={`button btn-alt btn-icon ${styles.toggleDetailBtn}`}
      onClick={handleClick}
      data-active={showDetails}
      type="button"
      title="Toggle Details"
    >
      <Icon id={Icons.CARET_RIGHT} alt="Details" />
    </button>
  );
}
