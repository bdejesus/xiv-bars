import React, { PureComponent } from 'react';
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
