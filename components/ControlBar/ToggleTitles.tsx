import { useAppDispatch, useAppState } from 'components/App/context';
import { AppAction } from 'components/App/actions';
import Icon from 'components/Icon';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

function ToggleTitles() {
  const appDispatch = useAppDispatch();
  const { showTitles } = useAppState();

  function handleTitlesToggle() { appDispatch({ type: AppAction.TOGGLE_TITLES }); }

  return (
    <button
      type="button"
      onClick={() => handleTitlesToggle()}
      data-active={showTitles}
      className={styles.toggleTitlesBtn}
    >
      <Icon id="titles" title={I18n.ControlBar.ToggleTitles.titles_icon} />
      {I18n.ControlBar.ToggleTitles.titles}
    </button>
  );
}

export default ToggleTitles;
