/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react';
import db from 'lib/db';
import Head from 'next/head';
import Link from 'next/link';
import I18n from 'lib/I18n/locale/en-US';
import { AppContextProvider } from 'components/App/context';
import { useUserState, useUserDispatch } from 'components/User/context';
import { UserActions } from 'components/User/actions';
import GlobalHeader from 'components/GlobalHeader';
import JobMenu from 'components/JobSelect/JobMenu';
import LayoutsList from 'components/LayoutsList';
import Card from 'components/Card';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import Icon, { Icons } from 'components/Icon';
import { maxLayouts } from 'lib/user';
import { domain } from 'lib/host';
import type { GetServerSideProps } from 'next';
import type { UserProps } from 'types/User';
import type { ViewDataProps } from 'types/Layout';

import styles from './user.module.scss';

interface UserViewProps {
  user: UserProps
}

export default function User(props:UserViewProps) {
  const userDispatch = useUserDispatch();
  const { layouts } = useUserState();
  const canonicalUrl = `${domain}/user/${props.user.id}`;

  useEffect(() => {
    userDispatch({
      type: UserActions.UPDATE_LAYOUTS,
      payload: { layouts: props.user.layouts }
    });
  }, []);

  if (!props.user) return null;

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>{`${props.user.name} Layouts • XIVBARS`}</title>
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <div className="container section">
        <div className={styles.hgroup}>
          <h1 className="mt-md">
            <div className={styles.profile}>
              { props.user.image && <img src={props.user.image} alt="" className={styles.image} /> }
              {props.user.name}
            </div>
          </h1>
          <div className={styles.layoutsCount}>
            {layouts?.length ? layouts.length : '-'}/{maxLayouts}
            <Icon id={Icons.LAYOUTS} alt="Layouts" type="white" />
          </div>
        </div>

        { (!layouts || layouts.length <= 0) && (
          <h2 id="jobSelectTitle">
            {I18n.Pages.Me.no_layouts}
          </h2>
        ) }
      </div>

      { layouts && layouts.length > 0
        ? (
          <div className="container section">
            <LayoutsList layouts={layouts}>
              { layouts.length < maxLayouts && (
                <li>
                  <Link href="/">
                    <Card className={[styles.card, styles.newCard].join(' ')}>
                      <h4 className={styles.placeholder}>
                        <Icon id={Icons.ADD} type="white" alt="New Layout Icon" />
                        <span className="btn-layout">New Layout</span>
                      </h4>
                    </Card>
                  </Link>
                </li>
              )}
            </LayoutsList>
          </div>
        ) : (
          <div className="app-view">
            <div className="container">
              <JobMenu />
            </div>
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

  const user = await db.user.findFirst({
    where: {
      ...userQuery,
      deletedAt: null
    },
    select: {
      name: true,
      id: true,
      image: true,
      layouts: {
        where: {
          deletedAt: null
        },
        select: {
          id: true,
          title: true,
          description: true,
          jobId: true,
          isPvp: true,
          layout: true,
          createdAt: true,
          updatedAt: true,
          userId: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }
    }
  });

  if (!user) return { notFound: true };

  const serializedLayouts = user.layouts.map((layout:ViewDataProps) => ({
    ...layout,
    createdAt: layout.createdAt?.toString(),
    updatedAt: layout.updatedAt?.toString(),
    user: { name: user.name }
  }));

  const serializedUser:UserProps = {
    name: user.name,
    id: user.id,
    image: user.image,
    layouts: serializedLayouts
  };

  return {
    props: {
      user: serializedUser
    }
  };
};
