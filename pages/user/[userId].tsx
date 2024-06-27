import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import db, { serializeDates, layoutsQuery } from 'lib/db';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { AppContextProvider } from 'components/App/context';
import { useUserState, useUserDispatch } from 'components/User/context';
import { userActions } from 'components/User/actions';
import GlobalHeader from 'components/GlobalHeader';
import LayoutsList from 'components/LayoutsList';
import Card from 'components/Card';
import Footer from 'components/Footer';
import Icon, { Icons } from 'components/Icon';
import JobSelect from 'components/JobSelect';
import { maxLayouts } from 'lib/user';
import { domain } from 'lib/host';
import type { GetServerSideProps } from 'next';
import type { UserProps } from 'types/User';
import type { LayoutViewProps } from 'types/Layout';

import styles from './userId.module.scss';

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
      type: userActions.UPDATE_LAYOUTS,
      payload: { layouts: user.layouts }
    });
  }, []);

  if (!user) return null;

  return (
    <>
      <Head>
        <title>{t('Pages.User.title', { userName: user.name })}</title>
        <meta
          name="description"
          content={t('Pages.User.description', { userName: user.name })}
        />
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <div className="container">
        <div className={styles.hgroup}>
          <h1 className="mt-md">
            <div className={styles.profile}>
              { user.image && <img src={user.image} alt="" className={styles.image} /> }
              {user.name}
            </div>
          </h1>

          { isCurrentUser && (
            <div className={styles.layoutsCount}>
              {layouts?.length ? layouts.length : '-'}/{maxLayouts}
              <Icon id={Icons.LAYOUTS} alt="Layouts" type="white" />
            </div>
          )}
        </div>

        { (!layouts || layouts.length <= 0) && (
          <h2 id="jobSelectTitle">
            {t('Pages.User.no_layouts')}
          </h2>
        ) }
      </div>

      { layouts && layouts.length > 0 && (
        <div className="container">
          <LayoutsList layouts={layouts}>
            { (layouts.length < maxLayouts && isCurrentUser) && (
              <li>
                <JobSelect className={styles.jobSelectCard} action="new">
                  <Card className={[styles.card, styles.newCard].join(' ')}>
                    <h4 className={styles.placeholder}>
                      <Icon id={Icons.ADD} type="white" alt={t('Pages.User.new_layout_icon')} />
                      <span className="btn-layout">{t('Pages.User.new_layout')}</span>
                    </h4>
                  </Card>
                </JobSelect>
              </li>
            )}
          </LayoutsList>
        </div>
      )}

      { isCurrentUser && user.hearts && user.hearts.length > 0 && (
        <div className="container">
          <h2>{t('Pages.User.saved_layouts')}</h2>
          <LayoutsList layouts={user.hearts} />
        </div>
      )}

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const userId = context.params?.userId as string;
  const isOwner = session?.user.id.toString() === userId;
  const id = parseInt(userId, 10);
  const userQuery = id ? { id } : { name: userId };

  const userLayoutsQuery = isOwner
    ? layoutsQuery
    : { ...layoutsQuery, where: { published: true } };

  const user = await db.user.findFirst({
    where: userQuery,
    select: {
      name: true,
      id: true,
      image: true,
      layouts: userLayoutsQuery
    }
  });

  const heartedLayouts = isOwner ? await db.layout.findMany({
    where: {
      published: true,
      hearts: {
        some: { userId: id }
      }
    },
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  }) : [];

  if (!user) return { notFound: true };

  const userLayouts = user.layouts.map((layout:LayoutViewProps) => layout);

  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      user: {
        name: user.name,
        id: user.id,
        image: user.image,
        hearts: serializeDates(heartedLayouts),
        layouts: serializeDates(userLayouts)
      }
    }
  };
};
