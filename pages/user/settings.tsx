import React, { useState, createRef } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession, signOut } from 'next-auth/react';
import { formatDateStringLong, timeElapsed } from 'lib/utils/time';
import { AppContextProvider } from 'components/App/';
import GlobalHeader from 'components/GlobalHeader';
import ProfileImage from 'components/User/ProfileImage';
import Footer from 'components/Footer';
import Modal from 'components/Modal';

import type { GetServerSideProps } from 'next';

import styles from './settings.module.scss';

export default function Settings() {
  const deleteForm = createRef<HTMLFormElement>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  if (!session) return null;

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

  function handleAccountDeletion() {
    setShowDeleteConfirm(true);
  }

  function checkUserConfirm(e:React.KeyboardEvent<HTMLInputElement>) {
    setUserConfirmed((e.currentTarget.value === user.name));
  }

  function cancelDeletion() {
    deleteForm.current?.reset();
    setShowDeleteConfirm(false);
  }

  return (
    <>
      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <div className={styles.settings}>
        <div className="container">
          <h1>Account Settings</h1>

          <div className={styles.profile}>
            <ProfileImage src={user.image} title={user.name} />

            <div>
              <div className={styles.name}>
                <b>{user.name}</b><span className={styles.userId}>#{user.id}</span>
              </div>

              <div className={styles.email}>
                {user.email}
              </div>

              <div className={styles.createdAt}>
                Registered on <time dateTime={user.createdAt}>{formatDateStringLong(user.createdAt!, router.locale)}</time>&nbsp;
                ({ timeElapsed(user.createdAt!) } days old)
              </div>

              <div className={styles.layouts}>
                {user._count.layouts} layouts saved, {user._count.hearts} hearts given
              </div>
            </div>
          </div>

          <div className={styles.accountDeletion}>
            <button
              type="button"
              className="btn-danger"
              onClick={handleAccountDeletion}
            >
              Delete My Account
            </button>

            <Modal
              showModal={showDeleteConfirm}
              onClose={() => cancelDeletion()}
            >
              <div className="container-sm">
                <h1>Are you sure you want to delete your account?</h1>

                <p>Your layouts, hearts, and other account associated information will be deleted. There’s no going back once you confirm...</p>

                <form autoComplete="off" ref={deleteForm}>
                  <div className="control">
                    <label htmlFor="confirmUserName">
                      Enter your username (<b>{user.name}</b>) to confirm:
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
                      className="button btn-danger"
                      onClick={destroyAccount}
                      disabled={!userConfirmed}
                    >
                      DELETE MY ACCOUNT
                    </button>

                    <button
                      type="button"
                      className="button btn-white"
                      onClick={cancelDeletion}
                    >
                      Take me back
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common']))
    }
  }
};
