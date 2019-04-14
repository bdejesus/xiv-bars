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

    const handleDrop = (event, attr) => {
      this.props.addActionToSlot({ event, attr });
      event.currentTarget.setAttribute('data-state', null);
    };

    const handleDragOver = event => event.currentTarget.setAttribute('data-state', 'active');

    const handleDragLeave = event => event.currentTarget.setAttribute('data-state', null);

    return (
      <div
        id={id}
        className={`${styles.slot} ${styles[id]}`}
        onDrop={event => handleDrop(event, attributes)}
        onDragOver={event => handleDragOver(event)}
        onDragLeave={event => handleDragLeave(event)}
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
