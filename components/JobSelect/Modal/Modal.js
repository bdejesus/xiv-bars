import React from 'react';
import PropTypes from 'prop-types';
import Job from '../Job';
import JobsList from '../JobsList';
import { useJobSelectState, useJobSelectDispatch } from '../context';
import styles from './styles.scss';

function Modal({ jobs, selectedJob }) {
  const DoW = jobs.filter((job) => job.Discipline === 'DOW');
  const DoM = jobs.filter((job) => job.Discipline === 'DOM');
  const DoH = jobs.filter((job) => job.Discipline === 'DOH');
  const DoL = jobs.filter((job) => job.Discipline === 'DOL');
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

      <div className={styles.modal} aria-hidden={!isSelectingJob} tabIndex={-1}>
        <div className={styles.container}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => jobSelectDispatch({ type: 'close' })}
          >
            &times; Close
          </button>
          <ul className={styles.options} labeledby="jobSelectButton">
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
