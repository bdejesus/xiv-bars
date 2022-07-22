import PropTypes from 'prop-types';

import Modal from 'components/Modal';
import SelectedJob from './SelectedJob';
import JobMenu from './JobMenu';
import { useJobSelectState, useJobSelectDispatch } from './context';
import styles from './JobSelect.module.scss';

export function JobSelect({ jobs, selectedJob }) {
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

      <Modal
        hidden={!isSelectingJob}
        toClose={() => jobSelectDispatch({ type: 'close' })}
      >
        <JobMenu jobs={jobs} />
      </Modal>
    </>
  );
}

JobSelect.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selectedJob: PropTypes.shape({
    ID: PropTypes.number,
    Icon: PropTypes.string,
    Abbr: PropTypes.string,
    Name: PropTypes.string
  }).isRequired
};

export default JobSelect;
