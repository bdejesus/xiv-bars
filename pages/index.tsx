import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import * as Sentry from '@sentry/nextjs';
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
import CanonicalUrl from 'components/LanguagePicker/CanonicalUrl';
import Jobs from 'apiData/Jobs.json';
import dynamic from 'next/dynamic';
import type { GetServerSideProps } from 'next';
import type { LayoutViewProps } from 'types/Layout';

import styles from './Index.module.scss';

const AdUnit = dynamic(() => import('components/AdUnit'), { ssr: false });

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
        <CanonicalUrl />
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <Hero />

      <div className="app-view">
        <div
          className="container"
          itemScope
          itemType="https://schema.org/ItemList"
        >
          <h2 className={styles.title} id="jobSelectTitle" itemProp="name">
            { t('JobSelect.job_select') }
          </h2>
          <JobMenu />
        </div>
      </div>

      <div className="container">
        <AdUnit id="ad-IndexPage" />
      </div>

      <div className="container">
        { recentLayouts?.length > 0 && (
          <LayoutsList
            id="recentLayouts"
            className={styles.recentLayouts}
            title={t('Pages.Index.recent_layouts')}
            layouts={recentLayouts}
          />
        )}

        { popularLayouts?.length >= 5 && (
          <LayoutsList
            id="popularLayouts"
            className={styles.popularLayouts}
            title={t('Pages.Index.popular_layouts')}
            layouts={popularLayouts}
          />
        ) }
      </div>

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
        select: { name: true, image: true }
      },
      _count: {
        select: { hearts: true }
      },
    },
    where: {
      title: { not: '' },
      description: { not: '' },
      published: true
    }
  };

  try {
    const layouts = await db.layout.findMany({
      ...layoutsQuery,
      take: 24,
      distinct: ['userId'],
      orderBy: { updatedAt: 'desc' }
    });

    const popularLayouts = await db.layout.findMany({
      ...layoutsQuery,
      take: 24,
      orderBy: {
        hearts: { _count: 'desc' }
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
  } catch (error) {
    Sentry.captureException(error);

    return {
      props: {
        ...(await serverSideTranslations(context.locale as string, ['common'])),
        recentLayouts: [],
        popularLayouts: []
      }
    };
  }
};
