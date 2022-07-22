import PropTypes from 'prop-types';
import I18n from 'lib/I18n/locale/en-US';
import styles from './CloseButton.module.scss';

export function CloseButton({ onClick, className }) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      onClick={onClick}
    >
      {I18n.Global.close}
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
