import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import db, { serializeDates } from 'lib/db';
import Head from 'next/head';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import HowTo from 'components/HowTo';
import Hero from 'components/Hero';
import JobMenu from 'components/JobSelect/JobMenu';
import Footer from 'components/Footer';
import EorzeaProfile from 'components/EorzeaProfile';
import LayoutsList from 'components/LayoutsList';
import Jobs from 'apiData/Jobs.json';
import type { GetServerSideProps } from 'next';
import type { LayoutViewProps } from 'types/Layout';

import styles from './Index.module.scss';

interface QueryProps {
  job?: string,
  s1?: string,
  s?: string
}

interface IndexProps {
  recentLayouts: LayoutViewProps[],
  popularLayouts: LayoutViewProps[]
}

export default function Index({ recentLayouts, popularLayouts }:IndexProps) {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const jobAbbrs = Jobs.map(({ Abbr }) => Abbr);
    // `s` param is deprecated but is there to provide backward support
    // for an earlier format of the encodedSlots
    const { job, s1, s } = router.query as QueryProps;
    if (job && jobAbbrs.includes(job)) {
      router.push({ pathname: `/job/${job}`, query: { s1, s } });
    }
  }, [router]);

  return (
    <>
      <Head>
        <link rel="canonical" href="https://www.xivbars.com" />
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <div className={styles.header}>
        <Hero />
      </div>

      <div className="container">
        <p className="system-message warn">
          The <b>Viper (VPR)</b> and <b>Pictomancer (PCT)</b> Class/Jobs are now available in a preview/development state. Layouts created prior to the release of patch 7.0 may break as Actions and other features associated with those Jobs are subject to change.
        </p>
      </div>

      <div className="app-view">
        <div
          className="container"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <h2 className={styles.title} id="jobSelectTitle" itemProp="name">
            { t('JobSelect.class_job') }
          </h2>
          <JobMenu />
        </div>
      </div>

      { popularLayouts?.length >= 5 ? (
        <div className={`container ${styles.lists}`}>
          <div className={styles.recentLayouts}>
            <LayoutsList
              title={t('Pages.Index.recent_layouts')}
              layouts={recentLayouts}
            />
          </div>

          <div className={styles.popularLayouts}>
            <LayoutsList
              title={t('Pages.Index.popular_layouts')}
              layouts={popularLayouts}
            />
          </div>
        </div>
      ) : (
        <div className="container">
          <LayoutsList
            title={t('Pages.Index.recent_layouts')}
            layouts={recentLayouts}
          />
        </div>
      ) }

      <HowTo />
      <EorzeaProfile />
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const layoutsQuery = {
    include: {
      user: {
        select: { name: true }
      },
      _count: {
        select: { hearts: true }
      }
    }
  };

  const layouts = await db.layout.findMany({
    ...layoutsQuery,
    take: 12,
    where: {
      title: { not: '' },
      description: { not: '' }
    },
    distinct: ['userId'],
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const popularLayouts = await db.layout.findMany({
    ...layoutsQuery,
    take: 6,
    where: {
      title: { not: '' },
      description: { not: '' },
    },
    orderBy: {
      hearts: {
        _count: 'desc'
      }
    }
  });
  const filteredPopularLayouts = popularLayouts.filter((layout:LayoutViewProps) => layout._count.hearts > 0);

  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common'])),
      recentLayouts: serializeDates(layouts),
      popularLayouts: serializeDates(filteredPopularLayouts)
    }
  };
};
