import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addActionToSlot } from '../../../actions';
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
    const { id, action, selectedAction } = this.props;

    const resetSlot = event => event.currentTarget.setAttribute('data-state', 'inactive');

    const onDrop = (event) => {
      event.preventDefault();
      // eslint-disable-next-line react/destructuring-assignment
      this.props.addActionToSlot({
        event,
        action: selectedAction
      });
      resetSlot(event);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      event.currentTarget.setAttribute('data-state', 'active');
    };

    const Action = () => (
      <React.Fragment>
        <div className={styles.action}>
          <img src={action.Icon} alt="" title={action.Name} />
        </div>
      </React.Fragment>
    );

    return (
      <div
        id={id}
        className={`${styles.slot} ${styles[id]}`}
        onDrop={event => onDrop(event)}
        onDragOver={event => handleDragOver(event)}
        onDragLeave={event => resetSlot(event)}
        role="button"
      >
        { action && <Action /> }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slot);

Slot.propTypes = {
  id: PropTypes.number.isRequired,
  action: PropTypes.shape(),
  addActionToSlot: PropTypes.func.isRequired,
  selectedAction: PropTypes.shape()
};

Slot.defaultProps = {
  action: {},
  selectedAction: {}
};
