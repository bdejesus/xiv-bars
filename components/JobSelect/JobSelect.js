import React from 'react';
import PropTypes from 'prop-types';
import CloseButton from 'components/CloseButton';
import SelectedJob from './SelectedJob';
import JobMenu from './JobMenu';
import { useJobSelectState, useJobSelectDispatch } from './context';
import styles from './JobSelect.module.scss';

function Modal({ jobs, selectedJob }) {
  const jobSelectDispatch = useJobSelectDispatch();
  const { isSelectingJob } = useJobSelectState();

  return (
    <>
      <button
        type="button"
        id="jobSelectTitle"
        className={styles.button}
        onClick={() => jobSelectDispatch({ type: 'open' })}
      >
        <SelectedJob job={selectedJob} />
      </button>

      <div className={styles.modal} aria-hidden={!isSelectingJob} tabIndex={-1}>
        <div className={styles.container}>
          <CloseButton onClick={() => jobSelectDispatch({ type: 'close' })} />
          <JobMenu jobs={jobs} />
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
