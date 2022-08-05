import { useAppDispatch, useAppState } from 'components/App/context';
import styles from './ControlBar.module.scss';

function ToggleMaxLvl() {
  const appDispatch = useAppDispatch();
  const { showAllLvl } = useAppState();

  function handleMaxLvlToggle() { appDispatch({ type: 'toggleAllLvl' }); }

  return (
    <button
      type="button"
      onClick={() => handleMaxLvlToggle()}
      data-active={showAllLvl}
      className={styles.toggleTitlesBtn}
    >
      <img src="/images/icon-levels.svg" className="btn-icon" alt="Max Lvl Icon" />
      All levels
    </button>
  );
}

export default ToggleMaxLvl;
