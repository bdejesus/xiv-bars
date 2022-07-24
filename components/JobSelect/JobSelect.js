import PropTypes from 'prop-types';
import SelectedJob from './SelectedJob';

import styles from './JobSelect.module.scss';

export function JobSelect({ selectedJob, toOpen, disabled }) {
  return (
    <button
      type="button"
      id="jobSelectTitle"
      className={styles.button}
      onClick={toOpen}
      disabled={disabled}
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
  toOpen: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

JobSelect.defaultProps = {
  disabled: false
};

export default JobSelect;
