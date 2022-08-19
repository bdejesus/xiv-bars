import { useSession, signIn } from 'next-auth/react';
import { useAppDispatch, useAppState } from 'components/App/context';
import { maxLayouts } from 'lib/user';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

function ToggleSaveForm() {
  const { data: session } = useSession();
  const appDispatch = useAppDispatch();
  const { viewData } = useAppState();
  const canPublish = session && !viewData && (maxLayouts);
  const canEdit = session && (session.user.id === viewData?.userId);

  function showForm() { appDispatch({ type: 'editLayout' }); }

  function handleSignin(e) {
    e.preventDefault();
    signIn('discord');
  }

  return (
    <div className={styles.control}>
      { canPublish || canEdit ? (
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
          { canPublish && I18n.ControlBar.ToggleSaveForm.publish }
          { canEdit && I18n.ControlBar.ToggleSaveForm.edit }
        </button>
      ) : (
        <a
          href="/api/auth/signin"
          onClick={handleSignin}
          className={styles.upsell}
        >
          {I18n.ControlBar.ToggleSaveForm.signin}
        </a>
      ) }
    </div>
  );
}

export default ToggleSaveForm;
