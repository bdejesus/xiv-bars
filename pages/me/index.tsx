/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import LoadScreen from 'components/LoadScreen';

// This page is deprecated
// The /me view now redirects to user/[userId]

export default function Me() {
  const { t } = useTranslation();
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  useEffect(() => {
    if (session?.user.id) router.push(`/user/${session.user.id}`);
  }, [session]);

  if (status !== 'authenticated') return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{t('Pages.User.title', { userName: session.user.name })}</title>
      </Head>

      <LoadScreen />
    </>
  );
}
