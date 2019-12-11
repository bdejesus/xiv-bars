import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Job from '../Job';
import { useJobSelectDispatch } from '../context';

import styles from './styles.scss';

function JobsList({ title, jobs }) {
  const jobSelectDispatch = useJobSelectDispatch();

  function selectJob(event, jobAbbr) {
    event.preventDefault();
    Router.push({
      pathname: '/',
      query: { job: jobAbbr },
      shallow: true
    });
    jobSelectDispatch({ type: 'close' });
  }

  return (
    <div className={styles.group}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.options}>
        {jobs.map((job) => (
          <li
            key={job.Name}
            value={job.ID}
          >
            <a
              href={`/job/${job.Abbr}`}
              draggable={false}
              onClick={(event) => selectJob(event, job.Abbr)}
            >
              <Job job={job} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

JobsList.propTypes = {
  title: PropTypes.string.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default JobsList;
