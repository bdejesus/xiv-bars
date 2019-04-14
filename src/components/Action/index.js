import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { storeAction } from '../../actions';
import styles from './styles.scss';

function mapDispatchToProps(dispatch) {
  return {
    storeAction: action => dispatch(storeAction(action))
  };
}

class Action extends PureComponent {
  handleDragStart(action) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.storeAction({ action });
  }

  render() {
    const { action } = this.props;

    return (
      <React.Fragment>
        <div
          className={styles.action}
          draggable
          onDragStart={() => { this.handleDragStart(action); }}
        >
          <img src={action.Icon} alt="" />
        </div>
        <div className={styles.tooltip}>
          <b>{action.Name}</b>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(Action);

Action.propTypes = {
  action: PropTypes.shape().isRequired,
  storeAction: PropTypes.func.isRequired
};
