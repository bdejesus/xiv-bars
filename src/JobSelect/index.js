import React, { Component } from 'react';
import Text from '../utils/text';
import styles from './styles.scss';

class JobSelect extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let jobsList = []
    if (this.props.jobs) {
      jobsList = this.props.jobs.map((job) => {
        return (
          <option key={`job-${job.ID}`} value={job.ID}>{Text.titleize(job.Name)}</option>
        )
      })
    }

    const jobListSelect =
      <div className={styles.jobSelectWrapper}>
        <select name='jobSelect' id='jobSelect' className={styles.jobSelect} onChange={(event) => this.props.updateJob(event)}>
          { jobsList }
        </select>
      </div>

    return (
      <React.Fragment>
        <h2>Job</h2>
        {jobListSelect}
      </React.Fragment>
    )
  }
}

export default JobSelect;
