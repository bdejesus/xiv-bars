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
  handleDrop(event, attr) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.addActionToSlot({ event, attr });
  }

  render() {
    const {
      id, action
    } = this.props;

    const attributes = { id };

    return (
      <div
        id={id}
        className={`${styles.slot} ${styles[id]}`}
        onDrop={event => this.handleDrop(event, attributes)}
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
