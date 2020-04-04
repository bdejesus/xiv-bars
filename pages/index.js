import React from 'react';
import PropTypes from 'prop-types';
import XIVAPI from 'xivapi-js';
import { ascByKey } from 'utils';
import { ADVANCED_JOBS, ROLE_ACTION_IDS } from 'data/jobs';
import Header from 'components/Header';
import Articles from 'components/Articles';
import Footer from 'components/Footer';
import JobSelect from 'components/JobSelect';
import { JobSelectContextProvider } from 'components/JobSelect/context';
import JobMenu from 'components/JobSelect/JobMenu';
import XIVBars from './XIVBars';
import { XIVBarsContextProvider } from './XIVBars/context';

import styles from './styles.scss';

function Index({
  jobs,
  actions,
  selectedJob,
  roleActions,
  query
}) {
  return (
    <>
      {(selectedJob) ? (
        <XIVBarsContextProvider actions={actions}>
          <div className={styles.header}>
            <div className="container">
              <div className="row">
                <JobSelectContextProvider>
                  <JobSelect jobs={jobs} selectedJob={selectedJob} />
                </JobSelectContextProvider>
              </div>

              <div className={styles.description}>
                {/* eslint-disable-next-line react/no-danger */}
                <p dangerouslySetInnerHTML={{ __html: selectedJob.Description }} />
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
      ) : (
        <>
          <div className={styles.header}>
            <Header query={query} selectedJob={selectedJob} jobs={jobs} />
          </div>
          <div className={styles.primary}>
            <JobSelectContextProvider>
              <JobMenu jobs={jobs} />
            </JobSelectContextProvider>
          </div>
        </>
      )}

      <div className={styles.articles}>
        <Articles />
      </div>

      <div className={styles.footer}>
        <Footer />
      </div>
    </>
  );
}

Index.getInitialProps = async (req) => {
  const ctx = req;

  // eslint-disable-next-line global-require
  const api = new XIVAPI();

  // Get Jobs List
  const jobsData = await api.data.list('ClassJob');
  const jobs = jobsData.Results.sort(ascByKey('Name'));

  function decorateJobs() {
    const decoratedData = ADVANCED_JOBS.map((advancedJob) => {
      const jobData = jobs.find((job) => job.ID === advancedJob.ID);
      return { ...jobData, ...advancedJob };
    });
    return decoratedData;
  }

  const decoratedJobs = decorateJobs();

  // Get Selected Job
  const { query } = ctx;
  const selectedJob = query.job ? decoratedJobs.find((job) => job.Abbr === query.job) : null;

  let jobActions = [];
  let roleActions = [];

  if (selectedJob) {
    // Get Job Actions
    const jobActionsData = await api.search('', {
      filters: `ClassJob.ID=${selectedJob.ID}`
    });
    jobActions = jobActionsData.Results;

    if (selectedJob.ClassID !== null) {
      const classActionsReq = await api.search('', {
        filters: `ClassJob.ID=${selectedJob.ClassID}`
      });
      jobActions = jobActions.concat(classActionsReq.Results);
    }

    jobActions = jobActions.filter((action) => action.UrlType === 'Action');
    jobActions = jobActions.sort(ascByKey('Icon'));
    jobActions = jobActions.filter(
      (action, index, self) => index === self.findIndex((t) => t.Name === action.Name)
    );

    if (selectedJob.Role) {
      const roleActionsData = await api.data.list('Action', { ids: ROLE_ACTION_IDS[selectedJob.Role].toString() });
      roleActions = roleActionsData.Results;
    }
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
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  query: PropTypes.shape().isRequired
};

Index.defaultProps = {
  selectedJob: null
};

export default Index;
