import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addActionToSlot } from '../../../actions';
import Action from '../../Action';
import styles from './styles.scss';

function mapStateToProps(state) {
  return {
    selectedAction: state.selectedAction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addActionToSlot: action => dispatch(addActionToSlot(action))
  };
}

class Slot extends PureComponent {
  render() {
    const {
      xbar, id, action, selectedAction
    } = this.props;

    const resetSlot = event => event.currentTarget.setAttribute('data-state', 'inactive');

    const handleDragLeave = (event) => {
      event.preventDefault();
      this.props.addActionToSlot({
        event,
        action: {},
        xbar
      });
      resetSlot(event);
    };

    const handleDrop = (event) => {
      event.preventDefault();

      // eslint-disable-next-line react/destructuring-assignment
      this.props.addActionToSlot({
        event,
        action: selectedAction,
        xbar
      });
      resetSlot(event);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      event.currentTarget.setAttribute('data-state', 'active');
    };

    return (
      <div
        id={id}
        className={styles.slot}
        onDrop={event => handleDrop(event)}
        onDragOver={event => handleDragOver(event)}
        onDragLeave={event => handleDragLeave(event)}
        role="button"
      >
        {action.Name && <Action action={action} slotted />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slot);

Slot.propTypes = {
  id: PropTypes.number.isRequired,
  action: PropTypes.shape(),
  addActionToSlot: PropTypes.func.isRequired,
  selectedAction: PropTypes.shape(),
  xbar: PropTypes.string.isRequired
};

Slot.defaultProps = {
  action: {},
  selectedAction: {}
};
