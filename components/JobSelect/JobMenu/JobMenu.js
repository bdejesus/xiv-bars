import React from 'react';
import PropTypes from 'prop-types';
import JobsList from '../JobsList';
import styles from './JobMenu.module.scss';

function JobMenu({ jobs }) {
  const DoW = jobs.filter((job) => job.Discipline === 'DOW');
  const DoM = jobs.filter((job) => job.Discipline === 'DOM');
  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');

  return (
    <>
      <ul className={styles.jobGroupList} labeledby="jobSelectTitle">
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

      <div className={styles.warning}>
        <p>
          The Sage [SGE] and Reaper [RPR] jobs are currently in beta as they haven’t been officially released yet. This means that you can use them to create layouts and export macros, but things can change or break until the official release of Endwalker.
        </p>
      </div>
    </>
  );
}

JobMenu.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default JobMenu;
