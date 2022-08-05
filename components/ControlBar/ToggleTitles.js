import { useAppDispatch, useAppState } from 'components/App/context';
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
      <img src="/images/icon-titles.svg" className="btn-icon" alt="Titles Icon" />
      Titles
    </button>
  );
}

export default ToggleTitles;
