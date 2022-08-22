import PropTypes from 'prop-types';
import { useSession, signIn } from 'next-auth/react';
import { useAppDispatch, useAppState } from 'components/App/context';
import { useUserState } from 'components/User/context';
import I18n from 'lib/I18n/locale/en-US';
import styles from './ControlBar.module.scss';

function PublishButton({ showForm }) {
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

PublishButton.propTypes = {
  showForm: PropTypes.func.isRequired
};

function EditButton({ showForm }) {
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

EditButton.propTypes = {
  showForm: PropTypes.func.isRequired
};

function ToggleSaveForm() {
  const { data: session, status } = useSession();

  const { viewData } = useAppState();
  const appDispatch = useAppDispatch();

  const canCreate = session && !viewData;
  const canEdit = session && (session.user.id === viewData?.userId);

  function showForm() { appDispatch({ type: 'editLayout' }); }

  function handleSignin(e) {
    e.preventDefault();
    signIn('discord');
  }

  return (
    <div className={styles.control}>
      { canCreate && <PublishButton showForm={() => showForm()} /> }
      { canEdit && <EditButton showForm={() => showForm()} /> }
      { status !== 'authenticated' && (
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
