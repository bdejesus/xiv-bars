import React from 'react';
import PropTypes from 'prop-types';
import Job from '../Job';
import JobsList from '../JobList';
import { useJobSelectState, useJobSelectDispatch } from '../context';
import styles from './styles.scss';

function Modal({ jobs, selectedJob }) {
  const combatJobs = jobs.filter((job) => ['DOW', 'DOM'].includes(job.Discipline));
  const craftingJobs = jobs.filter((job) => ['DOH', 'DOL'].includes(job.Discipline));
  const jobSelectDispatch = useJobSelectDispatch();
  const { isSelectingJob } = useJobSelectState();

  return (
    <>
      <button
        type="button"
        id="jobSelectButton"
        className={styles.button}
        onClick={() => jobSelectDispatch({ type: 'open' })}
      >
        <Job job={selectedJob} />
      </button>

      <div
        className={styles.modal}
        aria-hidden={!isSelectingJob}
        tabIndex={-1}
      >
        <div className={styles.container}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => jobSelectDispatch({ type: 'close' })}
          >
            &times; Close
          </button>
          <ul
            className={styles.options}
            labeledby="jobSelectButton"
          >
            <li>
              <JobsList title="DoW/DoM" jobs={combatJobs} />
            </li>
            <li>
              <JobsList title="DoH/DoL" jobs={craftingJobs} />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

Modal.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape({
    ID: PropTypes.number,
    Icon: PropTypes.string,
    Abbr: PropTypes.string,
    Name: PropTypes.string
  }).isRequired
};

export default Modal;
