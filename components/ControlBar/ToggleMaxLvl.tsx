import { useAppDispatch, useAppState } from 'components/App/context';
import { AppAction } from 'components/App/actions';
import Icon from 'components/Icon';
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
      <Icon
        id="levels"
        title={I18n.ControlBar.ToggleMaxLvl.all_levels_icon}
      />
      {I18n.ControlBar.ToggleMaxLvl.all_levels}
    </button>
  );
}

export default ToggleMaxLvl;
