import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Item extends PureComponent {
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

export default Item;

Item.propTypes = {
  dragged: PropTypes.func.isRequired,
  action: PropTypes.shape().isRequired
};
