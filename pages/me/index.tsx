/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import I18n from 'lib/I18n/locale/en-US';
import LoadScreen from 'components/LoadScreen';

export default function Me() {
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
        <title>{`${I18n.Pages.Me.my_layouts} • XIVBARS`}</title>
      </Head>

      <LoadScreen />
    </>
  );
}
