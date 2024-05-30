import { useTranslation } from 'next-i18next';
import { useAppDispatch, useAppState } from 'components/App/context';
import { appActions } from 'components/App/actions';
import Icon, { Icons } from 'components/Icon';

function ToggleTitles() {
  const { t } = useTranslation();
  const appDispatch = useAppDispatch();
  const { showTitles } = useAppState();

  function handleTitlesToggle() { appDispatch({ type: appActions.TOGGLE_TITLES }); }

  return (
    <button
      type="button"
      onClick={() => handleTitlesToggle()}
      data-active={showTitles}
      className="button btn-alt"
    >
      <Icon id={Icons.TITLES} alt={t('ControlBar.ToggleTitles.titles_icon')} />
      <span className="btn-label">{t('ControlBar.ToggleTitles.titles')}</span>
    </button>
  );
}

export default ToggleTitles;
