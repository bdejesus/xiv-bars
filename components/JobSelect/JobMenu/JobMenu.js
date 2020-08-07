import React from 'react';
import PropTypes from 'prop-types';
import JobsList from '../JobsList';
import styles from './styles.scss';

function JobMenu({ jobs }) {
  const DoW = jobs.filter((job) => job.Discipline === 'DOW');
  const DoM = jobs.filter((job) => job.Discipline === 'DOM');
  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <ul className={styles.options} labeledby="jobSelectTitle">
      <li>
        <JobsList title="DoW" jobs={DoW} />
      </li>
      <li>
        <JobsList title="DoM" jobs={DoM} />
      </li>
      <li>
        <JobsList title="DoH" jobs={DoH} />
      </li>
      <li>
        <JobsList title="DoL" jobs={DoL} />
      </li>
    </ul>
  );
}

JobMenu.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default JobMenu;
