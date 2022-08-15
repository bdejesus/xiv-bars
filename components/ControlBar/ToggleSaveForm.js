import { useSession, signIn } from 'next-auth/react';
import { useAppDispatch, useAppState } from 'components/App/context';
import styles from './ControlBar.module.scss';

function ToggleSaveForm() {
  const { data: session } = useSession();
  const appDispatch = useAppDispatch();
  const { viewData } = useAppState();
  const canPublish = session && !viewData;
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
          title="Save this Layout"
          onClick={showForm}
        >
          <img
            src="/images/icon-save.svg"
            className="btn-icon"
            alt="Details Icon"
          />
          { canPublish && 'Publish' }
          { canEdit && 'Edit' }
        </button>
      ) : (
        <a href="/api/auth/signin" onClick={handleSignin} className={styles.upsell}>
          Sign in to save and publish your layout
        </a>
      ) }
    </div>
  );
}

export default ToggleSaveForm;
