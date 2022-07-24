import PropTypes from 'prop-types';
import SelectedJob from './SelectedJob';

import styles from './JobSelect.module.scss';

export function JobSelect({ selectedJob, toOpen }) {
  return (
    <button
      type="button"
      id="jobSelectTitle"
      className={styles.button}
      onClick={toOpen}
    >
      <SelectedJob job={selectedJob} />
    </button>
  );
}

JobSelect.propTypes = {
  selectedJob: PropTypes.shape({
    ID: PropTypes.number,
    Icon: PropTypes.string,
    Abbr: PropTypes.string,
    Name: PropTypes.string
  }).isRequired,
  toOpen: PropTypes.func.isRequired
};

export default JobSelect;
