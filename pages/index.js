import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import App from 'components/App';

import { listJobs, listJobActions, listRoleActions } from 'lib/api';
import LoadScreen from 'components/LoadScreen';

import styles from './styles.module.scss';

function Index({
  jobs,
  actions,
  selectedJob,
  roleActions,
  host
}) {
  return (
    <>
      <App
        jobs={jobs}
        selectedJob={selectedJob}
        actions={actions}
        roleActions={roleActions}
        host={host}
      />

      <div className={styles.articles}>
        {(selectedJob) && <Header primary={(!selectedJob)} />}
        <Articles />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>

      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async ({ req, query }) => {
  const host = (typeof req !== 'undefined')
    ? req.headers.host
    : undefined;

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

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    host
  };
};

Index.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape(),
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  host: PropTypes.string
};

Index.defaultProps = {
  selectedJob: undefined,
  host: undefined
};

export default Index;
