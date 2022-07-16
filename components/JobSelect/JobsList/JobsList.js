import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Job from '../Job';

import styles from './JobsList.module.scss';

function JobsList({ title, jobs }) {
  return (
    <div className={styles.group}>
      <h4 className={styles.title}>{title}</h4>
      <ul className={styles.jobList}>
        {jobs.map((job) => (
          <li
            key={job.Name}
            value={job.ID}
          >
            <Link href={`/job/${job.Abbr}`}>
              <a draggable={false}>
                <Job job={job} />
              </a>
            </Link>
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
