import {
  listJobs,
  listJobActions,
  listRoleActions
} from 'lib/api';
import { group } from 'lib/utils/array';
import Link from 'next/link';
import Header from 'components/Header';
import HowTo from 'components/HowTo';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import Intro from 'components/Intro';
import App from 'components/App';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';

import styles from './Index.module.scss';

function Index(pageProps) {
  const { jobs, selectedJob } = pageProps;

  return (
    <>
      <div className={styles.view}>
        <div className={styles.header}>
          <Link href="/">
            <a className={styles.branding}>
              <img src="/icons/favicon-96x96.png" />
              <b className={styles.title}>XIVBARS</b>
              <span className={styles.subTitle}>
                A FFXIV WXHB Cross Hotbar Planner &amp; Simulator
              </span>
            </a>
          </Link>
        </div>

        { !selectedJob
          ? <Intro jobs={jobs} />
          : <App {...pageProps} /> }

      </div>
      <div className={styles.articles}>
        {(selectedJob) && <Header primary={(!selectedJob)} />}
        <HowTo />
        <EorzeaProfile />
        <Articles />
      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async ({ req, query }) => {
  const { s1, s } = query;
  const host = (typeof req !== 'undefined')
    ? req.headers.host
    : undefined;

  // Decode Slots query param
  const encodedSlots = () => {
    if (s1) return group(query.s1.split(','), 16);
    if (s) return JSON.parse(s);
    return undefined;
  };

  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = query.job
    ? decoratedJobs.find((job) => job.Abbr === query.job)
    : null;

  let jobActions = [];
  let roleActions = [];

  // Fetch Actions
  if (selectedJob) {
    jobActions = await listJobActions(selectedJob);
    // TODO: Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
    if (selectedJob.Role) {
      roleActions = await listRoleActions(selectedJob);
    }
  }

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    encodedSlots: encodedSlots(),
    host
  };
};

export default Index;
