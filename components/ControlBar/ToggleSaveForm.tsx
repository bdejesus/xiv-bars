import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppState } from 'components/App/context';
import { appActions } from 'components/App/actions';
import { useUserState } from 'components/User/context';
import Icon, { Icons } from 'components/Icon';
import styles from './ControlBar.module.scss';

interface ButtonProps {
  showForm: React.MouseEventHandler
}

function PublishButton({ showForm }: ButtonProps) {
  const { t } = useTranslation();
  const { canPublish } = useUserState();

  return (
    <button
      type="button"
      title={canPublish
        ? t('ControlBar.ToggleSaveForm.save_this_layout')
        : t('ControlBar.ToggleSaveForm.too_many_layouts')}
      onClick={showForm}
      disabled={(canPublish === false)}
      className="button btn-alt"
    >
      <Icon id={Icons.SAVE} alt={t('ControlBar.ToggleSaveForm.details_icon')} />
      <span className="btn-label">{t('ControlBar.ToggleSaveForm.publish')}</span>
    </button>
  );
}

function EditButton({ showForm }: ButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      title={t('ControlBar.ToggleSaveForm.save_this_layout')}
      onClick={showForm}
    >
      <Icon id={Icons.EDIT} alt={t('ControlBar.ToggleSaveForm.save_icon')} />
      <span className="btn-label">{t('ControlBar.ToggleSaveForm.edit') }</span>
    </button>
  );
}

function ToggleSaveForm() {
  const session = useSession();
  const { viewData } = useAppState();
  const { id, user } = viewData;
  const appDispatch = useAppDispatch();
  const canSaveNew = (session.status === 'authenticated' && !id);
  const canEdit = session.status === 'authenticated' && (session.data.user?.id === user?.id);
  function showForm() { appDispatch({ type: appActions.EDIT_LAYOUT }); }

  return (
    <div className={styles.control}>
      { canSaveNew && <PublishButton showForm={() => showForm()} /> }
      { canEdit && <EditButton showForm={() => showForm()} /> }
    </div>
  );
}

export default ToggleSaveForm;
