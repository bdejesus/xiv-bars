import React, { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSession } from 'next-auth/react';
import { formatDateStringLong, daysAgo } from 'lib/utils/time';
import { AppContextProvider } from 'components/App/';
import GlobalHeader from 'components/GlobalHeader';
import ProfileImage from 'components/User/ProfileImage';
import Footer from 'components/Footer';
import Modal from 'components/Modal';
import ConfirmDelete from 'components/User/Settings/ConfirmDelete';

import type { GetServerSideProps } from 'next';

import styles from './settings.module.scss';

export default function Settings() {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  if (!session) return null;

  const user = session.user;

  function handleAccountDeletion() {
    setShowDeleteConfirm(true);
  }

  function cancelDeletion() {
    setShowDeleteConfirm(false);
  }

  return (
    <>
      <Head>
        <title>{t('Pages.User.Settings.account_settings', { userName: user.name })} | {user.name} | XIVBARS</title>
      </Head>

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
                  { t('Pages.User.Settings.days_count', { count: daysAgo(user.createdAt!) }) }
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

            <Modal showModal={showDeleteConfirm} onClose={() => cancelDeletion()}>
              <ConfirmDelete onCancel={() => cancelDeletion()} />
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
