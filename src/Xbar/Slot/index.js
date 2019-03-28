import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Slot extends PureComponent {
  render() {
    const {
      action, index, onClick, onDrop,
    } = this.props;
    const handleOnClick = () => onClick(index);
    const handleDrop = () => onDrop(index);

    return (
      <div
        className={styles.slot}
        title={action.Name}
        onClick={() => handleOnClick()}
        onDrop={() => handleDrop()}
        role="button"
      >
        { action.Name }
      </div>
    );
  }
}

export default Slot;

Slot.propTypes = {
  index: PropTypes.number.isRequired,
  action: PropTypes.shape,
  onClick: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};

Slot.defaultProps = {
  action: null
};
