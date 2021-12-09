import {
  listJobs,
  listJobActions,
  listRoleActions
} from 'lib/api';
import { group } from 'lib/utils/array';
import GlobalHeader from 'components/GlobalHeader';
import Header from 'components/Header';
import HowTo from 'components/HowTo';
import Intro from 'components/Intro';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import App from 'components/App';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';

import styles from './Index.module.scss';

function Index(pageProps) {
  const { jobs, selectedJob } = pageProps;

  return (
    <>
      <GlobalHeader />

      { selectedJob ? <App {...pageProps} /> : <Intro jobs={jobs} /> }

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
    encodedSlots: encodedSlots()
  };
};

export default Index;
