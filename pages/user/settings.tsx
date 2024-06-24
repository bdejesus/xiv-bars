import React, { useState, createRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession, signOut } from 'next-auth/react';
import { formatDateStringLong, timeElapsed } from 'lib/utils/time';
import { AppContextProvider } from 'components/App/';
import ReactMarkdown from 'react-markdown';
import GlobalHeader from 'components/GlobalHeader';
import ProfileImage from 'components/User/ProfileImage';
import Footer from 'components/Footer';
import Modal from 'components/Modal';

import type { GetServerSideProps } from 'next';

import styles from './settings.module.scss';

export default function Settings() {
  const { t } = useTranslation();
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
          <h1>{ t('Pages.User.Settings.account_settings') }</h1>

          <div className={styles.profile}>
            <ProfileImage src={user.image} title={user.name} className={styles.profileImage} />

            <div>
              <div className={styles.name}>
                <b>{user.name}</b><span className={styles.userId}>#{user.id}</span>
              </div>

              <div className={styles.email}>
                {user.email}
              </div>

              <div className={styles.createdAt}>
                <div>
                  { t('Pages.User.Settings.registration_date') }&nbsp;
                  <time dateTime={user.createdAt}>{formatDateStringLong(user.createdAt!, router.locale)}</time>
                  <br />
                  { t('Pages.User.Settings.days_count', { count: timeElapsed(user.createdAt!) }) }
                </div>
              </div>

              <div className={styles.layouts}>
                <div>
                  { t('Pages.User.Settings.layouts_count', { count: user._count.layouts }) }
                </div>

                <div>
                  { t('Pages.User.Settings.hearts_count', { count: user._count.hearts }) }
                </div>
              </div>
            </div>
          </div>

          <div className={styles.accountDeletion}>
            <button
              type="button"
              className="btn-danger"
              onClick={handleAccountDeletion}
            >
              { t('Pages.User.Settings.delete_my_account') }
            </button>

            <Modal
              showModal={showDeleteConfirm}
              onClose={() => cancelDeletion()}
            >
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
                      onClick={cancelDeletion}
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
            </Modal>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const getServerSideProps:GetServerSideProps = async (context) => ({
  props: {
    ...(await serverSideTranslations(context.locale as string, ['common']))
  }
});
