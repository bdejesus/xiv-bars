import React, { useState, createRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession, signOut } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import styles from './ConfirmDelete.module.scss';

interface ConfirmDeleteProps {
  onCancel: React.MouseEventHandler<HTMLButtonElement>
}

export default function ConfirmDelete({ onCancel }:ConfirmDeleteProps) {
  const [userConfirmed, setUserConfirmed] = useState(false);
  const { t } = useTranslation();
  const { data: session } = useSession();
  if (!session) return null;

  const deleteForm = createRef<HTMLFormElement>();
  const user = session.user;

  async function destroyAccount() {
    await fetch('/api/user/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'destroy' })
    }).then(() => {
      signOut({ callbackUrl: '/' });
    });
  }

  function checkUserConfirm(e:React.KeyboardEvent<HTMLInputElement>) {
    setUserConfirmed((e.currentTarget.value === user.name));
  }

  function handleCancelDelete(e:React.MouseEvent<HTMLButtonElement>) {
    deleteForm.current?.reset();
    onCancel(e);
  }

  return (
    <div className="container-sm">
      <h1>{ t('Pages.User.Settings.are_you_sure') }</h1>
      <p className="text-xl">{ t('Pages.User.Settings.are_you_really_sure') }</p>

      <form autoComplete="off" ref={deleteForm}>
        <div className="control">
          <label htmlFor="confirmUserName">
            <ReactMarkdown>
              { t('Pages.User.Settings.enter_username', { user_name: user.name }) }
            </ReactMarkdown>
          </label>

          <input
            id="confirmUserName"
            name="confirmUserName"
            type="text"
            autoComplete="off"
            onKeyUp={checkUserConfirm}
          />
        </div>

        <div className={styles.deleteActions}>
          <button
            type="button"
            className="button btn-white"
            onClick={handleCancelDelete}
          >
            { t('Pages.User.Settings.cancel') }
          </button>

          <button
            type="button"
            className="button btn-danger"
            onClick={destroyAccount}
            disabled={!userConfirmed}
          >
            { t('Pages.User.Settings.delete') }
          </button>
        </div>
      </form>
    </div>
  );
}
