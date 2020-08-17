/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import JobSelect from 'components/JobSelect';
import { JobSelectContextProvider } from 'components/JobSelect/context';
import JobMenu from 'components/JobSelect/JobMenu';
import { listJobs, listJobActions, listRoleActions } from 'lib/api';
import LoadScreen from 'components/LoadScreen';
import shortDesc from 'lib/shortDesc';
import XIVBars from './XIVBars';
import { XIVBarsContextProvider } from './XIVBars/context';

import styles from './styles.scss';

function JobSelectView({ selectedJob, jobs }) {
  return (
    <>
      <div className={styles.header}>
        <Header selectedJob={selectedJob} />
      </div>
      <div className={styles.primary}>
        <div className="container">
          <JobSelectContextProvider>
            <h2 className={styles.title} id="jobSelectTitle">
              FFXIV Classes
            </h2>
            <JobMenu jobs={jobs} />
          </JobSelectContextProvider>
        </div>
      </div>
    </>
  );
}

JobSelectView.propTypes = {
  selectedJob: PropTypes.shape(),
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

JobSelectView.defaultProps = {
  selectedJob: null
};

function HotbarView({
  actions, selectedJob, jobs, roleActions
}) {
  return (
    <XIVBarsContextProvider actions={actions}>
      <div className={styles.header}>
        <div className="container">
          <div className="row">
            <JobSelectContextProvider>
              <JobSelect jobs={jobs} selectedJob={selectedJob} />
            </JobSelectContextProvider>
          </div>

          <div className={styles.description}>
            <p className={styles.jobDesc}>
              {shortDesc(selectedJob, actions)}
            </p>
            { selectedJob.Description && (
            <div className={styles.lore}>
              <h3>Lore</h3>
              <p
                dangerouslySetInnerHTML={{ __html: selectedJob.Description }}
              />
            </div>
            )}
          </div>

        </div>
      </div>
      <div className={styles.primary}>
        <XIVBars
          jobs={jobs}
          actions={actions}
          selectedJob={selectedJob}
          roleActions={roleActions}
        />
      </div>
    </XIVBarsContextProvider>
  );
}

HotbarView.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape().isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

function Index({
  jobs,
  actions,
  selectedJob,
  roleActions
}) {
  return (
    <>
      {(!selectedJob)
        ? (
          <JobSelectView selectedJob={selectedJob} jobs={jobs} />
        )
        : (
          <HotbarView
            actions={actions}
            selectedJob={selectedJob}
            jobs={jobs}
            roleActions={roleActions}
          />
        )}

      <div className={styles.articles}>
        {(selectedJob) && <Header selectedJob={selectedJob} />}
        <Articles />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>

      <LoadScreen />
    </>
  );
}

Index.getInitialProps = async ({ query }) => {
  // Get Selected Job
  const decoratedJobs = await listJobs();
  const selectedJob = query.job ? decoratedJobs.find((job) => job.Abbr === query.job) : null;

  let jobActions = [];
  let roleActions = [];

  // Fetch Actions
  if (selectedJob) {
    jobActions = await listJobActions(selectedJob);
    // Refactor this is pull IDS from ClassJob object instead of ROLE_ACTION_IDS
    if (selectedJob.Role) roleActions = await listRoleActions(selectedJob);
  }

  return {
    jobs: decoratedJobs,
    actions: jobActions,
    selectedJob,
    roleActions,
    query
  };
};

Index.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape(),
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

Index.defaultProps = {
  selectedJob: null
};

export default Index;
