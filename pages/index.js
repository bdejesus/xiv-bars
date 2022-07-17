import { useEffect } from 'react';
import { useRouter } from 'next/router';
import GlobalHeader from 'components/GlobalHeader';
import HowTo from 'components/HowTo';
import Intro from 'components/Intro';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';
import { listJobs, } from '../lib/api';
// import { useSession } from 'next-auth/react';

import styles from './Index.module.scss';

function Index(pageProps) {
  const router = useRouter();
  const { jobs } = pageProps;

  useEffect(() => {
    const jobAbbrs = jobs.map(({ Abbr }) => Abbr);
    // `s` param is deprecated but is there to provide backward support
    // for an earlier format of the encodedSlots
    const { job, s1, s } = router.query;
    if (jobAbbrs.includes(job)) {
      router.push({ pathname: `/job/${job}`, query: { s1, s } });
    }
  }, [router]);

  return (
    <>
      <GlobalHeader />
      <Intro jobs={jobs} />

      <div className={styles.articles}>
        <HowTo />
        <EorzeaProfile />
        <Articles />
      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async () => {
  // Get Selected Job
  const decoratedJobs = await listJobs();

  return {
    jobs: decoratedJobs,
  };
};

export default Index;
