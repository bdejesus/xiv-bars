import React from 'react';
import PropTypes from 'prop-types';
import { titleize } from 'utils/text';
import styles from './styles.scss';

function JobSelect({ jobs, updateJob }) {
  function jobsList() {
    if (!jobs) return [];
    return jobs.map(job => (
      <option key={`job-${job.ID}`} value={job.ID}>
        {titleize(job.Name)}
      </option>
    ));
  }

  function JobListSelect() {
    return (
      <div className={styles.selectWrapper}>
        <label>
          <h3>Class</h3>
          {jobsList() && (
            <select
              name="jobSelect"
              id="jobSelect"
              className={styles.select}
              onBlur={() => {
                console.log('blur');
              }}
              onChange={event => updateJob(event.currentTarget.value)}
            >
              {jobsList()}
            </select>
          )}
        </label>
      </div>
    );
  }

  function DisciplineSelect() {
    return (
      <div className={styles.selectWrapper} aria-hidden>
        <label>
          <h3>Discipline</h3>
          <select
            name="disciplineSelect"
            id="disciplineSelect"
            className={styles.select}
          >
            <option value="dow">DoW</option>
            <option value="dom">DoM</option>
            <option value="doh">DoH</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <DisciplineSelect />
      <JobListSelect />
    </div>
  );
}

JobSelect.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  updateJob: PropTypes.func.isRequired
};

export default JobSelect;
