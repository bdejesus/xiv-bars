import { useAppDispatch, useAppState } from 'components/App/context';
import { AppActions } from 'components/App/actions';
import Icon, { Icons } from 'components/Icon';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

function ToggleTitles() {
  const appDispatch = useAppDispatch();
  const { showTitles } = useAppState();

  function handleTitlesToggle() { appDispatch({ type: AppActions.TOGGLE_TITLES }); }

  return (
    <button
      type="button"
      onClick={() => handleTitlesToggle()}
      data-active={showTitles}
      className={`${styles.toggleTitlesBtn} button btn-alt`}
    >
      <Icon id={Icons.TITLES} alt={I18n.ControlBar.ToggleTitles.titles_icon} />
      <span className="btn-label">{I18n.ControlBar.ToggleTitles.titles}</span>
    </button>
  );
}

export default ToggleTitles;
