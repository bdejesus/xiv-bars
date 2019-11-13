/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { titleize } from 'utils/text';
import styles from './styles.scss';

function handleJobChange(event) {
  Router.push({
    pathname: '/',
    query: { id: event.currentTarget.value }
  });
}

function JobSelect({ jobs, selectedJob }) {
  function jobsList() {
    if (!jobs) return [];
    return jobs.map((job) => (
      <option key={`job-${job.ID}`} value={job.ID}>
        {titleize(job.Name)}
      </option>
    ));
  }

  function JobListSelect() {
    return (
      <div className={styles.selectWrapper}>
        <label>
          <h3>Job</h3>
          {jobsList() && (
            <select
              name="jobSelect"
              id="jobSelect"
              className={styles.select}
              value={selectedJob.ID}
              onChange={(event) => {
                handleJobChange(event);
              }}
              onBlur={(event) => {
                handleJobChange(event);
              }}
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
  selectedJob: PropTypes.shape({
    ID: PropTypes.number
  }).isRequired
};

export default JobSelect;
