import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import db from 'lib/db';
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

import styles from './Index.module.scss';

interface QueryProps {
  job?: string,
  s1?: string,
  s?: string
}

interface IndexProps {
  layouts: string
}

export default function Index({ layouts }:IndexProps) {
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

      <div className="container mt-lg">
        <h2>Recent Layouts</h2>
        <LayoutsList layouts={JSON.parse(layouts)} />
      </div>

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
  const layouts = await db.layout.findMany({
    orderBy: {
      updatedAt: 'desc'
    },
    take: 9,
    include: {
      user: {
        select: { name: true }
      }
    }
  });

  return {
    props: {
      layouts: JSON.stringify(layouts)
    }
  };
};
