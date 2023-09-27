import { useAppDispatch, useAppState } from 'components/App/context';
import I18n from 'lib/I18n/locale/en-US';
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
      <img
        src="/images/icon-levels.svg"
        className="btn-icon"
        alt={I18n.ControlBar.ToggleMaxLvl.all_levels_icon}
      />
      {I18n.ControlBar.ToggleMaxLvl.all_levels}
    </button>
  );
}

export default ToggleMaxLvl;
