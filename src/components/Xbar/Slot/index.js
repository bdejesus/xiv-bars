import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addActionToSlot } from '../../../actions';
import styles from './styles.scss';

function mapDispatchToProps(dispatch) {
  return {
    addActionToSlot: action => dispatch(addActionToSlot(action))
  };
}

class Slot extends PureComponent {
  render() {
    const {
      id, action
    } = this.props;

    const attributes = { id };

    const resetSlot = event => event.currentTarget.setAttribute('data-state', null);

    const handleDrop = (event, attr) => {
      this.props.addActionToSlot({ event, attr });
      resetSlot(event);
    };

    const handleDragOver = event => event.currentTarget.setAttribute('data-state', 'active');

    return (
      <div
        id={id}
        className={`${styles.slot} ${styles[id]}`}
        onDrop={event => handleDrop(event, attributes)}
        onDragOver={event => handleDragOver(event)}
        onDragLeave={event => resetSlot(event)}
        role="button"
      >
        { action && action.Name }
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Slot);

Slot.propTypes = {
  id: PropTypes.string.isRequired,
  action: PropTypes.shape(),
  addActionToSlot: PropTypes.func.isRequired
};

Slot.defaultProps = {
  action: null
};
