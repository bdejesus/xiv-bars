import React from 'react';
import PropTypes from 'prop-types';
import Xbar from 'components/Xbar';
import Action from 'components/Action';
import JobSelect from 'components/JobSelect';
import Tooltip from 'components/Tooltip';

import styles from './styles.scss';

function XIVBars({ jobs, actions, selectedJob }) {
  const ActionsList = actions.map((action) => (
    <li key={`action-${action.ID}`}>
      <Action action={action} />
    </li>
  ));

  return (
    <>
      <div className="panel">
        <div className={styles.xbarGroup}>
          <Xbar />
        </div>

        <div className={styles.panel}>
          <div className="content-layout content-middle">
            <div className="content-main">
              {jobs && <JobSelect jobs={jobs} selectedJob={selectedJob} />}
            </div>
          </div>

          <div className={styles.listActions}>
            <ul className={styles.listActions}>{actions && ActionsList}</ul>
          </div>
        </div>
      </div>

      <Tooltip />
    </>
  );
}

XIVBars.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape().isRequired
};

export default XIVBars;
