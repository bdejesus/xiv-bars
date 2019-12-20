import React from 'react';
import PropTypes from 'prop-types';
import XIVAPI from 'xivapi-js';
import { ascByKey } from 'utils';
import { advancedJobs, roleActionIDs } from 'models/jobs';
import XIVBars from './XIVBars';

function Index({
  jobs, actions, selectedJob, roleActions
}) {
  return (
    <XIVBars
      jobs={jobs}
      actions={actions}
      selectedJob={selectedJob}
      roleActions={roleActions}
    />
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
    const decoratedData = advancedJobs.map((advancedJob) => {
      const jobData = jobs.find((job) => job.ID === advancedJob.ID);
      return { ...jobData, ...advancedJob };
    });
    return decoratedData;
  }

  const decoratedJobs = decorateJobs();

  // Get Selected Job
  const { query } = ctx;

  let queryId = 'BRD';

  const getSelectedJob = () => {
    if (query.job) {
      queryId = query.job;
    }
    return decoratedJobs.find((job) => job.Abbr === queryId);
  };

  const selectedJob = getSelectedJob();

  // Get Job Actions
  const jobActionsData = await api.search('', {
    filters: `ClassJob.ID=${selectedJob.ID}`
  });
  let jobActions = jobActionsData.Results;

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

  let roleActions = [];
  if (selectedJob.Role) {
    const roleActionsData = await api.data.list('Action', { ids: roleActionIDs[selectedJob.Role].toString() });
    roleActions = roleActionsData.Results;
  }

  return {
    jobs: decoratedJobs, actions: jobActions, selectedJob, roleActions
  };
};

Index.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape().isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default Index;
