import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Action extends PureComponent {
  render() {
    const { dragged, action } = this.props;

    return (
      <div
        className={styles.action}
        draggable
        onDragStart={() => { dragged(action); }}
      >
        { action.Name }
      </div>
    );
  }
}

export default Action;

Action.propTypes = {
  dragged: PropTypes.func.isRequired,
  action: PropTypes.shape().isRequired
};
