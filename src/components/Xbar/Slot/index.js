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
    const { id, action } = this.props;

    const resetSlot = event => event.currentTarget.setAttribute('data-state', 'inactive');

    const onDrop = (event) => {
      console.log('drop');
      // eslint-disable-next-line react/destructuring-assignment
      this.props.addActionToSlot({ event });
      resetSlot(event);
    };

    const handleDragOver = (event) => {
      event.currentTarget.setAttribute('data-state', 'active');
    };

    return (
      <div
        id={id}
        className={`${styles.slot} ${styles[id]}`}
        onDrop={event => onDrop(event)}
        onDragOver={event => handleDragOver(event)}
        onDragLeave={event => resetSlot(event)}
        onClick={() => console.log('hi')}
        role="button"
      >
        { action && action.Name }
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Slot);

Slot.propTypes = {
  id: PropTypes.number.isRequired,
  action: PropTypes.shape(),
  addActionToSlot: PropTypes.func.isRequired
};

Slot.defaultProps = {
  action: null
};
