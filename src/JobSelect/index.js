import React, { PureComponent } from 'react';
import { titleize } from '../utils/text';
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
        <select
          name="jobSelect"
          id="jobSelect"
          className={styles.jobSelect}
          onChange={event => updateJob(event)}
        >
          { jobsList }
        </select>
      </div>
    );

    return (
      <React.Fragment>
        <h2>Job</h2>
        {jobListSelect}
      </React.Fragment>
    );
  }
}

export default JobSelect;
