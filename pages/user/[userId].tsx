/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import db from 'lib/db';
import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AppContextProvider } from 'components/App/context';
import { useUserState, useUserDispatch } from 'components/User/context';
import { UserActions } from 'components/User/actions';
import GlobalHeader from 'components/GlobalHeader';
import LayoutsList from 'components/LayoutsList';
import Card from 'components/Card';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import Icon, { Icons } from 'components/Icon';
import { maxLayouts } from 'lib/user';
import { domain } from 'lib/host';
import type { GetServerSideProps } from 'next';
import type { UserProps } from 'types/User';
import type { LayoutViewProps } from 'types/Layout';

import styles from './user.module.scss';

interface UserViewProps {
  user: UserProps
}

export default function User({ user }:UserViewProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const isCurrentUser = user.id === session?.user.id;
  const userDispatch = useUserDispatch();
  const { layouts } = useUserState();
  const canonicalUrl = `${domain}/user/${user.name}`;

  useEffect(() => {
    userDispatch({
      type: UserActions.UPDATE_LAYOUTS,
      payload: { layouts: user.layouts }
    });
  }, []);

  if (!user) return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{`Hotbar Layouts by ${user.name} • XIVBARS`}</title>
        <meta name="description" content={`FFXIV hotbar and cross hotbar UI layouts by ${user.name}. Explore various configurations and setups for Final Fantasy XIV’s hotbar and cross hotbar user interfaces, optimizing your gameplay experience with different placement, size, and customization options.`} />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <div className="container section">
        <div className={styles.hgroup}>
          <h1 className="mt-md">
            <div className={styles.profile}>
              { user.image && <img src={user.image} alt="" className={styles.image} /> }
              {user.name}
            </div>
          </h1>
          <div className={styles.layoutsCount}>
            {layouts?.length ? layouts.length : '-'}/{maxLayouts}
            <Icon id={Icons.LAYOUTS} alt="Layouts" type="white" />
          </div>
        </div>

        { (!layouts || layouts.length <= 0) && (
          <h2 id="jobSelectTitle">
            {t('Pages.User.no_layouts')}
          </h2>
        ) }
      </div>

      { layouts && layouts.length > 0 && (
        <div className="container section">
          <LayoutsList layouts={layouts}>
            { (layouts.length < maxLayouts && isCurrentUser) && (
              <li>
                <Link href="/">
                  <Card className={[styles.card, styles.newCard].join(' ')}>
                    <h4 className={styles.placeholder}>
                      <Icon id={Icons.ADD} type="white" alt={t('Pages.User.new_layout_icon')} />
                      <span className="btn-layout">{t('Pages.User.new_layout')}</span>
                    </h4>
                  </Card>
                </Link>
              </li>
            )}
          </LayoutsList>
        </div>
      )}

      { isCurrentUser && user.hearts && user.hearts.length > 0 && (
        <div className="container section">
          <h2>{t('Pages.User.saved_layouts')}</h2>
          <LayoutsList layouts={user.hearts} />
        </div>
      )}

      <Footer />
      <LoadScreen />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context?.params?.userId as string;
  const id = parseInt(userId, 10);
  const userQuery = id ? { id } : { name: userId };

  const layoutColumns = {
    id: true,
    title: true,
    description: true,
    jobId: true,
    isPvp: true,
    layout: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: false,
    userId: true,
    _count: {
      select: { hearts: true }
    }
  };

  const layoutQuery = {
    where: {
      deletedAt: null
    },
    select: layoutColumns,
    orderBy: {
      updatedAt: 'desc'
    }
  };

  const heartsQuery = {
    select: {
      layout: {
        select: {
          ...layoutColumns,
          user: {
            select: {
              name: true,
              id: true
            }
          }
        }
      }
    }
  };

  const user = await db.user.findFirst({
    where: { ...userQuery, deletedAt: null },
    select: {
      name: true,
      id: true,
      image: true,
      layouts: layoutQuery,
      hearts: heartsQuery
    }
  });

  if (!user) return { notFound: true };

  const serializedLayouts = user.layouts.map((layout:LayoutViewProps) => ({
    ...layout,
    createdAt: layout.createdAt?.toString(),
    updatedAt: layout.updatedAt?.toString(),
    user: { name: user.name }
  }));

  const serializedHearts = user.hearts.map(({ layout }:{layout:LayoutViewProps}) => ({
    ...layout,
    createdAt: layout.createdAt?.toString(),
    updatedAt: layout.updatedAt?.toString()
  }));

  const serializedUser:UserProps = {
    name: user.name,
    id: user.id,
    image: user.image,
    hearts: serializedHearts,
    layouts: serializedLayouts
  };

  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      user: serializedUser
    }
  };
};
