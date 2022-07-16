import PropTypes from 'prop-types';
import {
  listJobs,
  listJobActions,
  listRoleActions
} from 'lib/api';
import I18n from 'lib/I18n/locale/en-US';
import { AppContextProvider } from 'components/App/context';
import GlobalHeader from 'components/GlobalHeader';
import Hero from 'components/Hero';
import Lore from 'components/Lore';
import HowTo from 'components/HowTo';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import App from 'components/App';
import LoadScreen from 'components/LoadScreen';
import EorzeaProfile from 'components/EorzeaProfile';
import shortDesc from 'lib/shortDesc';
import { useSession } from 'next-auth/react';

import styles from '../Index.module.scss';

export default function Index({
  jobs,
  selectedJob,
  actions,
  roleActions,
}) {
  const { data: session } = useSession();

  return (
    <>
      <GlobalHeader />

      <AppContextProvider
        actions={actions}
        roleActions={roleActions}
        selectedJob={selectedJob}
        jobs={jobs}
      >
        <App />
        <div className="container section">
          <div className={styles.description}>
            <h2>{selectedJob.Name} {I18n.Global.title}</h2>
            <p className={styles.jobDesc}>
              {shortDesc(selectedJob, actions)}
            </p>

            { selectedJob.Description && <Lore selectedJob={selectedJob} /> }
          </div>
        </div>
      </AppContextProvider>

      <div className={styles.articles}>
        {(selectedJob) && <Hero primary={(!selectedJob)} />}
        <HowTo />
        <EorzeaProfile />
        <Articles />
      </div>

      <Footer />
      <LoadScreen />
    </>
  );
}

export async function getStaticPaths() {
  const jobs = await listJobs();
  const paths = jobs.map((job) => `/job/${job.Abbr}`);
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const { params } = context;

  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = params.id
    ? decoratedJobs.find((job) => job.Abbr === params.id)
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
    props: {
      jobs: decoratedJobs,
      actions: jobActions,
      selectedJob,
      roleActions
    }
  };
}

Index.propTypes = {
  selectedJob: PropTypes.shape().isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
