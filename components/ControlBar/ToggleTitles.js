import { useAppDispatch, useAppState } from 'components/App/context';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

function ToggleTitles() {
  const appDispatch = useAppDispatch();
  const { showTitles } = useAppState();

  function handleTitlesToggle() { appDispatch({ type: 'toggleTitles' }); }

  return (
    <button
      type="button"
      onClick={() => handleTitlesToggle()}
      data-active={showTitles}
      className={styles.toggleTitlesBtn}
    >
      <img
        src="/images/icon-titles.svg"
        className="btn-icon"
        alt={I18n.ControlBar.ToggleTitles.titles_icon}
      />
      {I18n.ControlBar.ToggleTitles.titles}
    </button>
  );
}

export default ToggleTitles;
