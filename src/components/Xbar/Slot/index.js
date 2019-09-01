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
  constructor(props) {
    super(props);
    this.state = {
      dragging: false
    };
  }

  render() {
    const {
      xbar, id, action, selectedAction
    } = this.props;

    const resetSlot = (event) => {
      const { currentTarget } = event;
      if (currentTarget.getAttribute('data-state') === 'active') {
        currentTarget.setAttribute('data-state', 'inactive');
      }
    };

    const handleDragStart = () => {
      this.setState({ dragging: true });
    };

    const handleDragLeave = (event) => {
      event.preventDefault();
      const { dragging } = this.state;
      if (dragging) {
        this.props.addActionToSlot({
          event,
          action: {},
          xbar
        });
      }
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
      this.setState({ dragging: false });
      resetSlot(event);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      const { currentTarget } = event;

      if (currentTarget.getAttribute('data-state') !== 'active') {
        currentTarget.setAttribute('data-state', 'active');
      }
    };

    return (
      <div
        id={id}
        className={styles.slot}
        onDrop={event => handleDrop(event)}
        onDragStart={event => handleDragStart(event)}
        onDragOver={event => handleDragOver(event)}
        onDragLeave={event => handleDragLeave(event)}
        role="button"
      >
        {action.Name && <Action action={action} />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slot);

Slot.propTypes = {
  id: PropTypes.string.isRequired,
  action: PropTypes.shape(),
  addActionToSlot: PropTypes.func.isRequired,
  selectedAction: PropTypes.shape(),
  xbar: PropTypes.string.isRequired
};

Slot.defaultProps = {
  action: {},
  selectedAction: {}
};
