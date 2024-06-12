import { useTranslation } from 'next-i18next';
import { useAppDispatch, useAppState } from 'components/App/context';
import { appActions } from 'components/App/actions';
import Icon, { Icons } from 'components/Icon';

function ToggleMaxLvl() {
  const { t } = useTranslation();
  const appDispatch = useAppDispatch();
  const { showAllLvl } = useAppState();

  function handleMaxLvlToggle() { appDispatch({ type: appActions.TOGGLE_LVLS }); }

  return (
    <button
      type="button"
      onClick={() => handleMaxLvlToggle()}
      data-active={showAllLvl}
      className="button btn-alt"
    >
      <Icon id={Icons.LEVELS} alt={t('ControlBar.ToggleMaxLvl.all_levels_icon')} />
      <span className="btn-label">{t('ControlBar.ToggleMaxLvl.all_levels')}</span>
    </button>
  );
}

export default ToggleMaxLvl;
