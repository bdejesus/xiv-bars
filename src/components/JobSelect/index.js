import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'utils/text';
import styles from './styles.scss';

class JobSelect extends PureComponent {
  render() {
    const { jobs, updateJob } = this.props;

    let jobsList = [];
    if (jobs) {
      jobsList = jobs.map(job => (
        <option key={`job-${job.ID}`} value={job.ID}>{titleize(job.Name)}</option>
      ));
    }

    const jobListSelect = (
      <div className={styles.jobSelectWrapper}>
        {jobsList && (
          <select
            name="jobSelect"
            id="jobSelect"
            className={styles.jobSelect}
            onChange={event => updateJob(event.currentTarget.value)}
          >
            {jobsList}
          </select>
        )}
      </div>
    );

    return (
      <React.Fragment>
        {jobListSelect}
      </React.Fragment>
    );
  }
}

export default JobSelect;

JobSelect.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  updateJob: PropTypes.func.isRequired
};
