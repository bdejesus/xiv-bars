import PropTypes from 'prop-types';
import styles from './CloseButton.module.scss';

function CloseButton({ onClick, className }) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      &times; Close
    </button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string
};

CloseButton.defaultProps = {
  className: undefined
};

export default CloseButton;
