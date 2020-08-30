import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import App from 'components/App';

import {
  listJobs, listJobActions, listRoleActions, getCurrentPatch
} from 'lib/api';
import LoadScreen from 'components/LoadScreen';

import styles from './Index.styles.module.scss';

function Index(pageProps) {
  const { selectedJob, currentPatch } = pageProps;
  return (
    <>
      <App {...pageProps} />
      <div className={styles.articles}>
        {(selectedJob) && <Header primary={(!selectedJob)} />}
        <Articles />
      </div>
      <Footer currentPatch={currentPatch} />
      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async ({ req, query }) => {
  const host = (typeof req !== 'undefined')
    ? req.headers.host
    : undefined;

  const encodedSlots = (typeof query.s !== 'undefined')
    ? JSON.parse(query.s)
    : null;

  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = query.job ? decoratedJobs.find((job) => job.Abbr === query.job) : null;

  let jobActions = [];
  let roleActions = [];

  // Fetch Actions
  if (selectedJob) {
    jobActions = await listJobActions(selectedJob);
    // Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
    if (selectedJob.Role) {
      roleActions = await listRoleActions(selectedJob);
    }
  }

  // Fetch Version
  const currentPatch = await getCurrentPatch();

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    encodedSlots,
    host,
    currentPatch
  };
};

Index.propTypes = {
  selectedJob: PropTypes.shape(),
  currentPatch: PropTypes.shape().isRequired
};

Index.defaultProps = {
  selectedJob: undefined
};

export default Index;
