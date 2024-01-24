import { useAppDispatch, useAppState } from 'components/App/context';
import { AppAction } from 'components/App/actions';
import Icon, { Icons } from 'components/Icon';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

function ToggleMaxLvl() {
  const appDispatch = useAppDispatch();
  const { showAllLvl } = useAppState();

  function handleMaxLvlToggle() { appDispatch({ type: AppAction.TOGGLE_LVLS }); }

  return (
    <button
      type="button"
      onClick={() => handleMaxLvlToggle()}
      data-active={showAllLvl}
      className={`${styles.toggleTitlesBtn} button btn-alt`}
    >
      <Icon id={Icons.LEVELS} alt={I18n.ControlBar.ToggleMaxLvl.all_levels_icon} />
      <span className="btn-label">{I18n.ControlBar.ToggleMaxLvl.all_levels}</span>
    </button>
  );
}

export default ToggleMaxLvl;
