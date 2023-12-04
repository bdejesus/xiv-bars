import React from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserState } from 'components/User/context';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

interface ButtonProps {
  showForm: React.MouseEventHandler
}

function PublishButton({ showForm }: ButtonProps) {
  const { canPublish } = useUserState();

  return (
    <button
      type="button"
      title={canPublish
        ? I18n.ControlBar.ToggleSaveForm.save_this_layout
        : I18n.ControlBar.ToggleSaveForm.too_many_layouts}
      onClick={showForm}
      disabled={(canPublish === false)}
    >
      <img
        src="/images/icon-save.svg"
        className="btn-icon"
        alt={I18n.ControlBar.ToggleSaveForm.details_icon}
      />
      { I18n.ControlBar.ToggleSaveForm.publish }
    </button>
  );
}

function EditButton({ showForm }: ButtonProps) {
  return (
    <button
      type="button"
      title={I18n.ControlBar.ToggleSaveForm.save_this_layout}
      onClick={showForm}
    >
      <img
        src="/images/icon-save.svg"
        className="btn-icon"
        alt={I18n.ControlBar.ToggleSaveForm.details_icon}
      />
      { I18n.ControlBar.ToggleSaveForm.edit }
    </button>
  );
}

function ToggleSaveForm() {
  const { data: session } = useSession();

  const { viewData } = useAppState();
  const appDispatch = useAppDispatch();

  const canCreate = session && !viewData;
  const canEdit = session && (session.user?.id === viewData?.userId);

  function showForm() { appDispatch({ type: 'editLayout' }); }

  return (
    <div className={styles.control}>
      { canCreate && <PublishButton showForm={() => showForm()} /> }
      { canEdit && <EditButton showForm={() => showForm()} /> }
    </div>
  );
}

export default ToggleSaveForm;
