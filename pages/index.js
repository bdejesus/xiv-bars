import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import GlobalHeader from 'components/GlobalHeader';
import HowTo from 'components/HowTo';
import Intro from 'components/Intro';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';
import Jobs from '.apiData/Jobs.json';

import styles from './Index.module.scss';

function Index() {
  const router = useRouter();

  useEffect(() => {
    const jobAbbrs = Jobs.map(({ Abbr }) => Abbr);
    // `s` param is deprecated but is there to provide backward support
    // for an earlier format of the encodedSlots
    const { job, s1, s } = router.query;
    if (jobAbbrs.includes(job)) {
      router.push({ pathname: `/job/${job}`, query: { s1, s } });
    }
  }, [router]);

  return (
    <>
      <Head>
        <link rel="canonical" href="https://xivbars.bejezus.com" />
      </Head>

      <GlobalHeader />
      <Intro jobs={Jobs} />
      <div className={styles.articles}>
        <HowTo />
        <EorzeaProfile />
      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

export default Index;
