import React from 'react';
import PropTypes from 'prop-types';
import XIVAPI from 'xivapi-js';
import { ascByKey } from 'utils';
import { advancedJobs, roleActionIDs } from 'models/jobs';
import XIVBars from './XIVBars';

import styles from './styles.scss';

function Index({
  jobs, actions, selectedJob, roleActions, query
}) {
  return (
    <>
      <div className={`${styles.container} ${styles.primary}`}>
        {(query.job) ? (
          <>
            <h1>
              <span className={styles.abbr}>{selectedJob.Abbr}</span>
              <b>{selectedJob.Name}</b>
            </h1>
            <h2>XIV Bars</h2>
          </>
        ) : (
          <h1>XIV Bars</h1>
        )}
        <p>A Final Fantasy XIV W Cross HotBar (WXHB) Preview Tool.</p>
        <p>
          Simulate what your WXHB actions could look like when playing
          Final Fantasy XIV with a gamepad or controller. Use the Job
          selector to load actions for that class and Drag them into
          the hotbar slots below like you would in the game.
        </p>
        <XIVBars
          jobs={jobs}
          actions={actions}
          selectedJob={selectedJob}
          roleActions={roleActions}
        />
      </div>

      <div className={`${styles.container} ${styles.links}`}>
        <h3>
          <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
            Cross Hotbar Settings: Auto-switching for Battle
          </a>
        </h3>

        <p>
          How to set your Cross Hotbars in Controller Mode to auto-switch
          to a combat hotbar when entering battle stance.
        </p>

        <p>
          If you play in <b>Controller Mode</b>, you can set your Cross
          Hotbars to automatically switch to a different Hotbar whenever
          you go into battle stance. This frees you up from having to
          manually switch to the correct hotbar every time you&apos;re
          coming in and out of combat.
        </p>

        <p>
          <a href="https://josebenedicto.com/ffxiv/cross-hotbar-settings--auto-switching-for-battle">
            Read more...
          </a>
        </p>
      </div>

      <div className={`${styles.container} ${styles.info}`}>
        <p>
          <a href="https://xivapi.com/">Powered by XIVAPI</a>
        </p>
        <p>
          All Final Fantasy XIV content is property of Square Enix Co.,
          LTD
        </p>
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
  selectedJob: PropTypes.shape().isRequired,
  roleActions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  query: PropTypes.shape().isRequired
};

export default Index;
