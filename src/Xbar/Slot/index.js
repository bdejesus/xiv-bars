import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Slot extends PureComponent {
  render() {
    const {
      id, action, onClick, onDrop,
    } = this.props;

    const attributes = { id };
    const handleOnClick = () => onClick(attributes);
    const handleDrop = () => {
      onDrop(attributes);
    };

    return (
      <div
        id={id}
        className={`${styles.slot} ${styles[id]}`}
        onClick={() => handleOnClick()}
        onDrop={() => handleDrop()}
        role="button"
      >
        { action && action.Name }
      </div>
    );
  }
}

export default Slot;

Slot.propTypes = {
  id: PropTypes.string.isRequired,
  action: PropTypes.shape(),
  onClick: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};

Slot.defaultProps = {
  action: null
};
