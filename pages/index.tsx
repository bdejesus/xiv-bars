import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import db, { serialize } from 'lib/db';
import Head from 'next/head';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import HowTo from 'components/HowTo';
import Intro from 'components/Intro';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
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
        <link rel="canonical" href="https://xivbars.bejezus.com" />
      </Head>

      <AppContextProvider>
        <GlobalHeader />
      </AppContextProvider>

      <Intro />

      { popularLayouts?.length >= 5 ? (
        <div className={`container mt-xl ${styles.lists}`}>
          <div>
            <h2>Recent Layouts</h2>
            <LayoutsList layouts={recentLayouts} />
          </div>

          <div>
            <h2>Popular Layouts</h2>
            <LayoutsList layouts={popularLayouts} />
          </div>
        </div>
      ) : (
        <div className="container mt-xl">
          <h2>Recent Layouts</h2>
          <LayoutsList layouts={recentLayouts} />
        </div>
      ) }

      <div className={styles.articles}>
        <HowTo />
        <EorzeaProfile />
      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const layoutsQuery = {
    take: 5,
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
    where: {
      title: { not: '' },
      description: { not: '' }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const popularLayouts = await db.layout.findMany({
    ...layoutsQuery,
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
    // eslint-disable-next-line no-underscore-dangle
  const filteredPopularLayouts = popularLayouts.filter((layout:LayoutViewProps) => layout._count.hearts > 0);

  return {
    props: {
      recentLayouts: layouts.map(serialize),
      popularLayouts: filteredPopularLayouts.map(serialize)
    }
  };
};
